using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.Http.Connections;

namespace Ninja.Api.Tests;

public sealed class ApiSmokeTests
{
    [Fact]
    public async Task Health_endpoint_returns_ok()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Protected_endpoint_requires_token()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/v1/dashboard-configuration/harborlift");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Demo_token_can_access_tenant_dashboard_configuration()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();
        var token = await GetDemoTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/v1/dashboard-configuration/harborlift");
        var content = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK, content);
        content.Should().Contain("HarborLift Robotics");
        content.Should().Contain("dock-queue");
    }

    [Fact]
    public async Task Demo_token_can_connect_to_telemetry_hub_and_subscribe_to_tenant()
    {
        await using var factory = CreateFactory();
        using var client = factory.CreateClient();
        var token = await GetDemoTokenAsync(client);

        await using var connection = new HubConnectionBuilder()
            .WithUrl(new Uri(client.BaseAddress!, "/hubs/telemetry"), options =>
            {
                options.AccessTokenProvider = () => Task.FromResult<string?>(token);
                options.HttpMessageHandlerFactory = _ => factory.Server.CreateHandler();
                options.Transports = HttpTransportType.LongPolling;
            })
            .Build();

        await connection.StartAsync();
        await connection.InvokeAsync("SubscribeTenant", "harborlift");

        connection.State.Should().Be(HubConnectionState.Connected);
    }

    private static WebApplicationFactory<Program> CreateFactory()
    {
        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseSetting("environment", "Testing"));
    }

    private static async Task<string> GetDemoTokenAsync(HttpClient client)
    {
        var response = await client.PostAsJsonAsync("/api/v1/auth/demo-token", new
        {
            userId = "api-test",
            tenantSlugs = new[] { "white-label", "harborlift", "terragrid" }
        });

        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<DemoTokenPayload>();
        return payload!.AccessToken;
    }

    private sealed record DemoTokenPayload(string AccessToken);
}
