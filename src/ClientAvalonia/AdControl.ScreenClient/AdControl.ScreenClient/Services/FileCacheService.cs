using AdControl.ScreenClient.Core.Options;
using AdControl.ScreenClient.Core.Services.Abstractions;

namespace AdControl.ScreenClient.Services
{
    public class FileCacheService : IFileCacheService
    {
        private readonly string _cacheDir;
        private readonly HttpClient _http;

        public FileCacheService(IAppPaths paths, HttpClient http)
        {
            _cacheDir = paths.CacheDir;
            _http = http;

            Directory.CreateDirectory(_cacheDir);
        }

        public async Task<string> GetCachedFilePathAsync(string fileName, string? checksum, CancellationToken token)
        {
            var ext = Path.GetExtension(fileName);
            if (string.IsNullOrEmpty(ext))
                ext = ".bin";
            var key = !string.IsNullOrEmpty(checksum) ? checksum : Path.GetFileNameWithoutExtension(fileName);
            var cached = Path.Combine(_cacheDir, key + ext);
            if (File.Exists(cached))
                return cached;

            var url = "https://advertcontrol.ru/files/" + Uri.EscapeDataString(fileName);
            var tmp = Path.Combine(_cacheDir, Guid.NewGuid() + ext);
            using var resp = await _http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, token);
            resp.EnsureSuccessStatusCode();
            using var src = await resp.Content.ReadAsStreamAsync(token);
            using var dst = File.Create(tmp);
            await src.CopyToAsync(dst, token);

            try
            {
                File.Move(tmp, cached);
            }
            catch 
            { 
                if (File.Exists(tmp)) 
                    File.Delete(tmp); 
            }
            return cached;
        }
    }

}
