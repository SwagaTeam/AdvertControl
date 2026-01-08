namespace AdControl.ScreenClient.Core.Services.Abstractions
{
    public interface IFileCacheService
    {
        Task<string> GetCachedFilePathAsync(string fileName, string? checksum, CancellationToken token);
    }
}
