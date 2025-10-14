namespace AdControl.Auth;

public interface IKeycloakSetupService
{
    Task EnsureSetupAsync();
    string GetKeycloakRegistrationUrl(string realm, string clientId, string redirectUri);
    Task<string> GetJwtTokenAsync(string clientId, string username, string password, string realmName);
    Task CreateUserAsync(string username, string password, string realmName);
    Task<bool> LogoutAsync(string accessToken);
}