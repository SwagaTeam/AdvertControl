using System.Text.Json.Serialization;

namespace AdControl.Auth.Models
{
    public class CreateUserRequest
    {
        [JsonPropertyName("username")]    
        public string Email { get; set; }

        [JsonPropertyName("password")]    
        public string Password { get; set; }

        [JsonPropertyName("roles")]        
        public string[] Roles { get; set; }

        [JsonPropertyName("firstName")]
        public string Name { get; set; }

        [JsonPropertyName("lastName")]
        public string SecondName { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string Phone { get; set; }

        [JsonPropertyName("masterToken")]
        public string MasterToken { get; set; }
    }
}