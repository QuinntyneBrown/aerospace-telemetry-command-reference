namespace Ninja.Domain.ValueObjects;

public sealed record GeoPosition(decimal Latitude, decimal Longitude, decimal? HeadingDegrees = null)
{
    public GeoPosition Normalize()
    {
        if (Latitude is < -90 or > 90)
        {
            throw new ArgumentOutOfRangeException(nameof(Latitude), "Latitude must be between -90 and 90.");
        }

        if (Longitude is < -180 or > 180)
        {
            throw new ArgumentOutOfRangeException(nameof(Longitude), "Longitude must be between -180 and 180.");
        }

        return this;
    }
}

public sealed record BatteryState(decimal Percent, bool IsCharging)
{
    public BatteryState Clamp()
    {
        var percent = Math.Clamp(Percent, 0, 100);
        return this with { Percent = percent };
    }
}

public sealed record TemperatureReading(decimal Celsius);

public sealed record BrandMetadata(
    string DisplayName,
    string PrimaryColor,
    string AccentColor,
    string LogoText,
    string Terminology);
