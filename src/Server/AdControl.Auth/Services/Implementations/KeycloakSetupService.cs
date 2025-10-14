using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace AdControl.Auth;

public class KeycloakSetupService : IKeycloakSetupService
{
    private readonly HttpClient httpClient;
    private readonly string adminUser;
    private readonly string adminPassword;
    private readonly string keycloakBaseUrl;
    
    public KeycloakSetupService(HttpClient httpClient, IOptions<KeycloakOptions> options)
    {
        this.httpClient = httpClient;
        var o = options.Value;
        adminUser = o.AdminUser;
        adminPassword = o.AdminPassword;
        keycloakBaseUrl = o.BaseUrl ?? "http://keycloak:8080";
    }
    public async Task EnsureSetupAsync()
    {
        var token = await GetAdminTokenAsync();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        await EnsureRealmExistAsync("myrealm");
        await EnsureClientExistsAsync("myrealm", "myclient", "secret");
        await EnsureUserExistsAsync("myrealm", "testuser", "password");
    }

    private async Task<string> GetAdminTokenAsync()
    {
        var response = await httpClient.PostAsync($"{keycloakBaseUrl}/realms/master/protocol/openid-connect/token", 
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"grant_type", "password"},
                {"username", adminUser},
                {"password", adminPassword},
                {"client_id", "admin-cli"}
            }));

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error fetching token: {response.StatusCode} - {errorContent}");
        }

        var tokenJson = await response.Content.ReadAsStringAsync();
    
        if (!JsonDocument.Parse(tokenJson).RootElement.TryGetProperty("access_token", out var tokenProperty))
        {
            throw new KeyNotFoundException("Access token not found in the response.");
        }

        return tokenProperty.GetString();
    }

    private async Task EnsureRealmExistAsync(string realmName)
    {
        var response = await httpClient.GetAsync($"{keycloakBaseUrl}/admin/realms");
        var json = await response.Content.ReadAsStringAsync();

        if (!json.Contains(realmName))
        {
            var realm = new { realm = realmName, enabled = true };
            var content = new StringContent(JsonSerializer.Serialize(realm), Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"{keycloakBaseUrl}/admin/realms", content);
        }
    }

    private async Task EnsureClientExistsAsync(string realm, string clientId, string secret)
    {
        var response = await httpClient.GetAsync($"{keycloakBaseUrl}/admin/realms/{realm}/clients/");
        var json = await response.Content.ReadAsStringAsync();
        if (!json.Contains(clientId))
        {
            var client = new
            {
                clientId,
                enabled = true,
                secret,
                standardFlowEnabled = true,
                directAccessGrantsEnabled = true,
            };
            var content = new StringContent(JsonSerializer.Serialize(client), Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"{keycloakBaseUrl}/admin/realms/{realm}/clients", content);
        }
    }

    private async Task EnsureUserExistsAsync(string realm, string username, string password)
    {
        var response = await httpClient.GetAsync($"{keycloakBaseUrl}/admin/realms/{realm}/users/");
        var json = await response.Content.ReadAsStringAsync();
        if (!json.Contains(username))
        {
            var client = new
            {
                username,
                enabled = true,
                credentials = new[]
                {
                    new { type = "password", value = password, temporary = false },
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(client), Encoding.UTF8, "application/json");
            await httpClient.PostAsync($"{keycloakBaseUrl}/admin/realms/{realm}/users", content);
        }
    }
    
    public string GetKeycloakRegistrationUrl(string realm, string clientId, string redirectUri)
    {
        var registerUri = $"{keycloakBaseUrl}/realms/{realm}/protocol/openid-connect/registrations?" +
                          $"client_id={clientId}&redirect_uri={redirectUri}";
        return registerUri;
    }
    
    public async Task<string> GetJwtTokenAsync(string clientId, string username, string password, string realmName)
    {
        var tokenResponse = await httpClient.PostAsync($"{keycloakBaseUrl}/realms/{realmName}/protocol/openid-connect/token", 
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"grant_type", "password"},
                {"username", username},
                {"password", password},
                {"client_id", clientId}
            }));
        
        var tokenJson = await tokenResponse.Content.ReadAsStringAsync();
        var jwtToken = JsonDocument.Parse(tokenJson).RootElement.GetProperty("access_token").GetString();
        
        return jwtToken;
    }
    
    public async Task CreateUserAsync(string username, string password, string realmName)
    {
        var newUser = new
        {
            username = username,
            enabled = true,
            credentials = new[]
            {
                new { type = "password", value = password, temporary = false }
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(newUser), Encoding.UTF8, "application/json");
        var response = await httpClient.PostAsync($"{keycloakBaseUrl}/admin/realms/{realmName}/users", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorMessage = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error creating user: {errorMessage}");
        }
    }
    
    public async Task<bool> LogoutAsync(string accessToken)
    {
        try
        {
            var response = await httpClient.PostAsync(
                $"{keycloakBaseUrl}/realms/myrealm/protocol/openid-connect/logout",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    {"token", accessToken}
                })
            );

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during logout: {ex.Message}");
            return false;
        }
    }
}