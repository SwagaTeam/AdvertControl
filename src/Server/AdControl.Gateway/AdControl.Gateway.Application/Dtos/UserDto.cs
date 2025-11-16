namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для пользователя.
/// </summary>
public class UserDto
{
    /// <summary>
    ///     Логин или email пользователя.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    ///     Роли пользователя.
    /// </summary>
    public string[] Roles { get; set; }
}