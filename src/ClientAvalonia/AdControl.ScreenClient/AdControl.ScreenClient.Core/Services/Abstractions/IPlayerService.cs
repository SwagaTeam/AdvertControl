using System.Dynamic;

namespace AdControl.ScreenClient.Core.Services.Abstractions
{
    public interface IPlayerService : IDisposable
    {
        Task ShowVideoAsync(ConfigItemDto item, CancellationToken token);
        Task ShowImageAsync(ConfigItemDto item, CancellationToken token, bool isMainWindow = true);
        Task ShowTableAsync(List<ExpandoObject> rows, int durationSeconds, CancellationToken token);
    }

}
