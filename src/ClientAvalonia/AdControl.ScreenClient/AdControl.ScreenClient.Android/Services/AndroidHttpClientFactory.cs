namespace AdControl.ScreenClient.Android.Services
{
    public class AndroidHttpClientFactory : IHttpClientFactory
    {
        private readonly HttpClient _client;
        public AndroidHttpClientFactory(HttpClient client) 
        { 
            _client = client;
        }
        public HttpClient CreateClient(string name) => _client;
    }

}
