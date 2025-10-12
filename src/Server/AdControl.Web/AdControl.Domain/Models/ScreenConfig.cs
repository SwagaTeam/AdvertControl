namespace AdControl.Domain.Models;

public class ScreenConfig
{
    public Guid Id { get; set; }
    public Guid ScreenId { get; set; }
    public Screen? Screen { get; set; }

    public Guid ConfigId { get; set; }
    public Config? Config { get; set; }

    public bool IsActive { get; set; }
    public DateTime AssignedAt { get; set; }
}