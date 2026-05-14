namespace Ninja.Api.Security;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "ninja-reference";

    public string Audience { get; init; } = "ninja-reference-clients";

    public string SigningKey { get; init; } = "local-development-signing-key-for-ninja-reference-architecture";

    public int DemoTokenHours { get; init; } = 8;
}
