namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для подтверждения привязки экрана.
/// </summary>
public class ConfirmPairDto
{
    /// <summary>
    ///     Код привязки.
    /// </summary>
    public string Code { get; set; } = null!;

    /// <summary>
    ///     Имя экрана (опционально).
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    ///     Разрешение экрана (опционально).
    /// </summary>
    public string? Resolution { get; set; }

    /// <summary>
    ///     Местоположение экрана (опционально).
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    ///     Время жизни назначения в минутах.
    /// </summary>
    public int AssignedTtlMinutes { get; set; }
}