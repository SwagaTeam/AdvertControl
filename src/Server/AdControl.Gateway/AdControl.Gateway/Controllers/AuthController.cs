using AdControl.Gateway.Application.Dtos;
using AdControl.Protos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdControl.Gateway.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService.AuthServiceClient authServiceClient;

    public AuthController(AuthService.AuthServiceClient authServiceClient)
    {
        this.authServiceClient = authServiceClient;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (!dto.Roles.Any(r => r is "Admin" or "User"))
            throw new Exception("User must have at least one valid role: 'User' or 'Admin'.");
        var request = new RegisterRequest
        {
            Email = dto.Username,
            Password = dto.Password,
            RepeatPassword = dto.RepeatPassword,
            Roles = { dto.Roles }
        };

        var resp = await authServiceClient.RegisterAsync(request);
        return Ok(resp);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var request = new LoginRequest
        {
            Email = dto.Username,
            Password = dto.Password
        };
        var resp = await authServiceClient.LoginAsync(request);
        return Ok(resp);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        var request = new LogoutRequest
        {
            Token = token
        };
        var resp = await authServiceClient.LogoutAsync(request);
        return Ok(resp);
    }

    [HttpPost("get-current-user-id")]
    public async Task<IActionResult> GetCurrentUserId()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var request = new UserIdRequest
        {
            Token = token
        };
        
        var resp = await authServiceClient.GetCurrentUserIdAsync(request);
        return Ok(resp);
    }

    [HttpPost("get-user-info-by/{id}")]
    public async Task<IActionResult> GetUserInfo(string id)
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        var requestUserId = new UserIdRequest
        {
            Token = token
        };
        var currentUserId = await authServiceClient.GetCurrentUserIdAsync(requestUserId);
        if (id != currentUserId.Id)
        {
            return Unauthorized();
        }
        var request = new UserInfoRequest
        {
            Id = id
        };

        var resp = await authServiceClient.GetUserInfoAsync(request);

        return Ok(resp);
    }
}