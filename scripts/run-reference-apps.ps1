[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$NoOpenBrowser,
    [switch]$NoRecordVideos,
    [switch]$StopOnExit
)

$ErrorActionPreference = 'Stop'

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptRoot '..')
$BackendRoot = Join-Path $RepoRoot 'backend'
$FrontendRoot = Join-Path $RepoRoot 'frontend'
$RuntimeRoot = Join-Path $RepoRoot 'artifacts\runtime'
$LogRoot = Join-Path $RepoRoot 'artifacts\logs'
$VideoRoot = Join-Path $RepoRoot 'artifacts\videos'

$apps = @(
    @{ Name = 'white-label-operations-console'; Port = 4200; Url = 'http://localhost:4200' },
    @{ Name = 'harborlift-robotics'; Port = 4201; Url = 'http://localhost:4201' },
    @{ Name = 'terragrid-autonomy'; Port = 4202; Url = 'http://localhost:4202' }
)

New-Item -ItemType Directory -Force -Path $RuntimeRoot, $LogRoot, $VideoRoot | Out-Null

function Stop-ProcessOnPort {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique

    foreach ($processId in $processIds) {
        if ($processId -gt 0) {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}

function Wait-HttpOk {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 90
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return
            }
        }
        catch {
            Start-Sleep -Milliseconds 500
        }
    } while ((Get-Date) -lt $deadline)

    throw "Timed out waiting for $Url"
}

function Invoke-LoggedCommand {
    param(
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$Arguments
    )

    Push-Location $WorkingDirectory
    try {
        & $FilePath @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed: $FilePath $($Arguments -join ' ')"
        }
    }
    finally {
        Pop-Location
    }
}

function Start-LoggedProcess {
    param(
        [string]$Name,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$Arguments
    )

    $stdout = Join-Path $LogRoot "$Name.out.log"
    $stderr = Join-Path $LogRoot "$Name.err.log"

    if (Test-Path $stdout) { Remove-Item -LiteralPath $stdout -Force }
    if (Test-Path $stderr) { Remove-Item -LiteralPath $stderr -Force }

    Start-Process `
        -FilePath $FilePath `
        -ArgumentList $Arguments `
        -WorkingDirectory $WorkingDirectory `
        -WindowStyle Hidden `
        -RedirectStandardOutput $stdout `
        -RedirectStandardError $stderr `
        -PassThru
}

$startedProcesses = @()

try {
    foreach ($port in @(5121, 4200, 4201, 4202)) {
        Stop-ProcessOnPort -Port $port
    }

    if (-not $SkipBuild) {
        Invoke-LoggedCommand -WorkingDirectory $BackendRoot -FilePath 'dotnet' -Arguments @('build', 'Ninja.ReferenceArchitecture.sln')

        if (-not (Test-Path (Join-Path $FrontendRoot 'node_modules'))) {
            Invoke-LoggedCommand -WorkingDirectory $FrontendRoot -FilePath 'npm.cmd' -Arguments @('install')
        }

        foreach ($project in @('white-label-ui', 'dashboard-platform', 'white-label-dashboard', 'harborlift-dashboard', 'terragrid-dashboard')) {
            Invoke-LoggedCommand -WorkingDirectory $FrontendRoot -FilePath 'npx.cmd' -Arguments @('ng', 'build', $project, '--configuration', 'development')
        }

        foreach ($app in $apps) {
            Invoke-LoggedCommand -WorkingDirectory $FrontendRoot -FilePath 'npx.cmd' -Arguments @('ng', 'build', $app.Name, '--configuration', 'development')
        }
    }

    $backend = Start-LoggedProcess `
        -Name 'backend' `
        -WorkingDirectory $BackendRoot `
        -FilePath 'dotnet' `
        -Arguments @('run', '--no-build', '--project', 'src\Ninja.Api\Ninja.Api.csproj', '--launch-profile', 'http')
    $startedProcesses += $backend
    Wait-HttpOk -Url 'http://localhost:5121/health' -TimeoutSeconds 90

    foreach ($app in $apps) {
        $process = Start-LoggedProcess `
            -Name $app.Name `
            -WorkingDirectory $FrontendRoot `
            -FilePath 'npx.cmd' `
            -Arguments @('ng', 'serve', $app.Name, '--host', 'localhost', '--port', [string]$app.Port)
        $startedProcesses += $process
    }

    foreach ($app in $apps) {
        Wait-HttpOk -Url $app.Url -TimeoutSeconds 120
    }

    $manifest = [ordered]@{
        backend = 'http://localhost:5121'
        dashboards = $apps
        pids = $startedProcesses | ForEach-Object { @{ id = $_.Id; name = $_.ProcessName } }
        logs = $LogRoot
        videos = $VideoRoot
    }
    $manifest | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $RuntimeRoot 'reference-apps.json')

    if (-not $NoOpenBrowser) {
        foreach ($app in $apps) {
            Start-Process $app.Url
        }
    }

    if (-not $NoRecordVideos) {
        Invoke-LoggedCommand `
            -WorkingDirectory $RepoRoot `
            -FilePath 'node' `
            -Arguments @('scripts\record-dashboard-videos.mjs')
    }

    Write-Host "Backend: http://localhost:5121"
    foreach ($app in $apps) {
        Write-Host "$($app.Name): $($app.Url)"
    }
    Write-Host "Logs: $LogRoot"
    Write-Host "Videos: $VideoRoot"
}
finally {
    if ($StopOnExit) {
        foreach ($process in $startedProcesses) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
