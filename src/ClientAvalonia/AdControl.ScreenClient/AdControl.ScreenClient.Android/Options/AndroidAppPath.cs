using Application = Android.App.Application;

namespace AdControl.ScreenClient.Core.Options
{
    public sealed class AndroidAppPaths : IAppPaths
    {
        public string CacheDir { get; }

        public AndroidAppPaths()
        {
            var context = Application.Context;

            CacheDir = Path.Combine(context.FilesDir.AbsolutePath, "cache");

            Directory.CreateDirectory(CacheDir);
        }
    }
}
