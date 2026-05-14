using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ninja.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alerts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MachineId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Severity = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Message = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    RaisedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    IsResolved = table.Column<bool>(type: "INTEGER", nullable: false),
                    ResolvedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alerts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CommandDefinitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Key = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    RequiredPermission = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    IsDangerous = table.Column<bool>(type: "INTEGER", nullable: false),
                    PayloadSchemaJson = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommandDefinitions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CommandExecutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MachineId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CommandKey = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    PayloadJson = table.Column<string>(type: "TEXT", nullable: false),
                    RequestedBy = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    RequestedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    FailureReason = table.Column<string>(type: "TEXT", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommandExecutions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DashboardLayouts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    LayoutJson = table.Column<string>(type: "TEXT", nullable: false),
                    UpdatedBy = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DashboardLayouts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeatureFlags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Key = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Enabled = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureFlags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MachineAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MachineId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MachineAssignments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Machines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Model = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    Latitude = table.Column<decimal>(type: "TEXT", precision: 9, scale: 6, nullable: false),
                    Longitude = table.Column<decimal>(type: "TEXT", precision: 9, scale: 6, nullable: false),
                    HeadingDegrees = table.Column<decimal>(type: "TEXT", precision: 6, scale: 2, nullable: true),
                    BatteryPercent = table.Column<decimal>(type: "TEXT", precision: 5, scale: 2, nullable: false),
                    IsCharging = table.Column<bool>(type: "INTEGER", nullable: false),
                    MissionState = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NavigationItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Label = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Route = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Icon = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NavigationItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OperationalEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MachineId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Message = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    OccurredAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperationalEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TelemetrySamples",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MachineId = table.Column<Guid>(type: "TEXT", nullable: false),
                    StreamKey = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    MetricKey = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    NumericValue = table.Column<decimal>(type: "TEXT", precision: 18, scale: 4, nullable: true),
                    TextValue = table.Column<string>(type: "TEXT", maxLength: 400, nullable: true),
                    PositionLatitude = table.Column<decimal>(type: "TEXT", precision: 9, scale: 6, nullable: true),
                    PositionLongitude = table.Column<decimal>(type: "TEXT", precision: 9, scale: 6, nullable: true),
                    PositionHeadingDegrees = table.Column<decimal>(type: "TEXT", precision: 6, scale: 2, nullable: true),
                    RecordedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TelemetrySamples", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TelemetryStreams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    TenantId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Key = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Unit = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    ValueKind = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TelemetryStreams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tenants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Brand_DisplayName = table.Column<string>(type: "TEXT", maxLength: 160, nullable: false),
                    Brand_PrimaryColor = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    Brand_AccentColor = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    Brand_LogoText = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Brand_Terminology = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tenants", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_TenantId_IsResolved_RaisedAt",
                table: "Alerts",
                columns: new[] { "TenantId", "IsResolved", "RaisedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_CommandDefinitions_TenantId_Key",
                table: "CommandDefinitions",
                columns: new[] { "TenantId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommandExecutions_TenantId_RequestedAt",
                table: "CommandExecutions",
                columns: new[] { "TenantId", "RequestedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_DashboardLayouts_TenantId",
                table: "DashboardLayouts",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeatureFlags_TenantId_Key",
                table: "FeatureFlags",
                columns: new[] { "TenantId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MachineAssignments_TenantId_MachineId_UserId",
                table: "MachineAssignments",
                columns: new[] { "TenantId", "MachineId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Machines_TenantId_Name",
                table: "Machines",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_NavigationItems_TenantId_SortOrder",
                table: "NavigationItems",
                columns: new[] { "TenantId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_OperationalEvents_TenantId_OccurredAt",
                table: "OperationalEvents",
                columns: new[] { "TenantId", "OccurredAt" });

            migrationBuilder.CreateIndex(
                name: "IX_TelemetrySamples_TenantId_MachineId_RecordedAt",
                table: "TelemetrySamples",
                columns: new[] { "TenantId", "MachineId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_TelemetryStreams_TenantId_Key",
                table: "TelemetryStreams",
                columns: new[] { "TenantId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tenants_Slug",
                table: "Tenants",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alerts");

            migrationBuilder.DropTable(
                name: "CommandDefinitions");

            migrationBuilder.DropTable(
                name: "CommandExecutions");

            migrationBuilder.DropTable(
                name: "DashboardLayouts");

            migrationBuilder.DropTable(
                name: "FeatureFlags");

            migrationBuilder.DropTable(
                name: "MachineAssignments");

            migrationBuilder.DropTable(
                name: "Machines");

            migrationBuilder.DropTable(
                name: "NavigationItems");

            migrationBuilder.DropTable(
                name: "OperationalEvents");

            migrationBuilder.DropTable(
                name: "TelemetrySamples");

            migrationBuilder.DropTable(
                name: "TelemetryStreams");

            migrationBuilder.DropTable(
                name: "Tenants");
        }
    }
}
