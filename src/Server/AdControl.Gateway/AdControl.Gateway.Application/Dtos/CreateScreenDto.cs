namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для создания экрана.
/// </summary>
public class CreateScreenDto
{
    /// <summary>
    ///     Имя экрана.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    ///     Разрешение экрана.
    /// </summary>
    public string? Resolution { get; set; }

    /// <summary>
    ///     Местоположение экрана.
    /// </summary>
    public string? Location { get; set; }
}