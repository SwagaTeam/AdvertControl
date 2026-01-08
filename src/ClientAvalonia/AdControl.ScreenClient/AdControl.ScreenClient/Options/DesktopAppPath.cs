using AdControl.ScreenClient.Core.Options;

namespace AdControl.ScreenClient.Options
{
    public sealed class DesktopAppPaths : IAppPaths
    {
        public string CacheDir { get; }

        public DesktopAppPaths()
        {
            var baseDir =
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            CacheDir = Path.Combine(baseDir, "AdControl", "Cache");
            Directory.CreateDirectory(CacheDir);
        }
    }
}
