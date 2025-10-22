namespace AdControl.Gateway.Application.Dtos;

/// <summary>
///     DTO для регистрации пользователя.
/// </summary>
public class RegisterDto
{
    /// <summary>
    ///     Логин или email пользователя.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    ///     Пароль пользователя.
    /// </summary>
    public string Password { get; set; }

    /// <summary>
    ///     Повтор пароля.
    /// </summary>
    public string RepeatPassword { get; set; }

    /// <summary>
    ///     Роли пользователя.
    /// </summary>
    public string[] Roles { get; set; }
}