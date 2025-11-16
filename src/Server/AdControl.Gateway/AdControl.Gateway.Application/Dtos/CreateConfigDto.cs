namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для создания конфигурации.
/// </summary>
public class CreateConfigDto
{
    /// <summary>
    ///     Список элементов конфигурации.
    /// </summary>
    public List<CreateConfigItemDto>? Items { get; set; }
}