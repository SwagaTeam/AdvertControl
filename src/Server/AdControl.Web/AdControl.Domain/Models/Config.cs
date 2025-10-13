namespace AdControl.Domain.Models;

public class Config
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ConfigItem> Items { get; set; } = new();
}