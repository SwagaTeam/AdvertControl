namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для назначения экрана.
/// </summary>
public class AssignDto
{
    public AssignDto(string screenId, bool isActive)
    {
        ScreenId = screenId;
        IsActive = isActive;
    }

    /// <summary>
    ///     Идентификатор экрана.
    /// </summary>
    public string ScreenId { get; set; }

    /// <summary>
    ///     Флаг активности экрана.
    /// </summary>
    public bool IsActive { get; set; }
}