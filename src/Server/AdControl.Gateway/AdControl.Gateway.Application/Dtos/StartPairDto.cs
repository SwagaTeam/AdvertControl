namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для старта привязки экрана.
/// </summary>
public class StartPairDto
{
    /// <summary>
    ///     Временный идентификатор экрана.
    /// </summary>
    public string TempDisplayId { get; set; } = default!;

    /// <summary>
    ///     Код привязки.
    /// </summary>
    public string Code { get; set; } = default!;

    /// <summary>
    ///     Время жизни кода в минутах.
    /// </summary>
    public int TtlMinutes { get; set; } = 10;

    /// <summary>
    ///     Дополнительная информация о экране.
    /// </summary>
    public string? Info { get; set; }
}