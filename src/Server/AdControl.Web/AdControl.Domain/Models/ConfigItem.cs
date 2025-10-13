namespace AdControl.Domain.Models;

public class ConfigItem
{
    public Guid Id { get; set; }
    public Guid ConfigId { get; set; }
    public Config? Config { get; set; }

    public string Type { get; set; } = "";
    public string UrlOrData { get; set; } = "";
    public string? Checksum { get; set; }
    public long Size { get; set; }
    public int DurationSeconds { get; set; }
    public int Order { get; set; }
}