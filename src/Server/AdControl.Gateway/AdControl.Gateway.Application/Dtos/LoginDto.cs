namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для логина пользователя.
/// </summary>
public class LoginDto
{
    /// <summary>
    ///     Логин или email пользователя.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    ///     Пароль пользователя.
    /// </summary>
    public string Password { get; set; }
}