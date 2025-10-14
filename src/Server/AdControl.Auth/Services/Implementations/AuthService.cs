using AdControl.Protos;
using Grpc.Core;

namespace AdControl.Auth;

public class AuthService : AdControl.Protos.AuthService.AuthServiceBase
{
    private readonly IKeycloakSetupService keycloakSetupService;

    public AuthService(IKeycloakSetupService keycloakSetupService)
    {
        this.keycloakSetupService = keycloakSetupService;
    }

    public override async Task<RegisterResponse> Register(RegisterRequest registerRequest, ServerCallContext context)
    {
        var username = registerRequest.Email;
        var password = registerRequest.Password;
        var clientId = "myclient";  
        var realmName = "myrealm";  

        await keycloakSetupService.CreateUserAsync(username, password, realmName);
        var jwtToken = await keycloakSetupService.GetJwtTokenAsync(clientId, username, password, realmName);
        return new RegisterResponse
        {
            Token = jwtToken
        };
    }

    public override async Task<LoginResponse> Login(LoginRequest loginRequest, ServerCallContext context)
    {
        var username = loginRequest.Email;
        var password = loginRequest.Password;
        var clientId = "myclient";
        var realmName = "myrealm";
        
        var jwtToken = await keycloakSetupService.GetJwtTokenAsync(clientId, username, password, realmName);
        return new LoginResponse
        {
            Token = jwtToken
        };
    }

    public override async Task<LogoutResponse> Logout(LogoutRequest logoutRequest, ServerCallContext context)
    {
        var accessToken = logoutRequest.Token;
        var logoutResponse = await keycloakSetupService.LogoutAsync(accessToken);

        if (logoutResponse)
        {
            return new LogoutResponse{Success = true};
        }
        
        throw new RpcException(new Status(StatusCode.Internal, "Logout failed"));
    }
}