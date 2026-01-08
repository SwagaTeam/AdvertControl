using System.Dynamic;
using AdControl.ScreenClient.Core.Services;
using AdControl.ScreenClient.Core.Services.Abstractions;
using Android.Views;
using Graphics = Android.Graphics;

namespace AdControl.ScreenClient.Android.Services
{
    public class AndroidPlayerService : IPlayerService
    {
        private readonly Activity _activity;
        private readonly VideoView _videoView;
        private readonly ImageView _imageView;
        private readonly TableLayout _tableLayout;
        private readonly IFileCacheService _fileCache;

        public AndroidPlayerService(Activity activity, VideoView videoView, ImageView imageView, TableLayout tableLayout, IFileCacheService fileCache)
        {
            _activity = activity ?? throw new ArgumentNullException(nameof(activity));
            _videoView = videoView ?? throw new ArgumentNullException(nameof(videoView));
            _imageView = imageView ?? throw new ArgumentNullException(nameof(imageView));
            _tableLayout = tableLayout ?? throw new ArgumentNullException(nameof(tableLayout));
            _fileCache = fileCache ?? throw new ArgumentNullException(nameof(fileCache));
        }

        public async Task ShowVideoAsync(ConfigItemDto item, CancellationToken token)
        {
            var localPath = await _fileCache.GetCachedFilePathAsync(item.Url, item.Checksum, token);

            _activity.RunOnUiThread(() =>
            {
                _tableLayout.Visibility = ViewStates.Gone;
                _imageView.Visibility = ViewStates.Gone;
                _videoView.Visibility = ViewStates.Visible;
                try
                { _videoView.StopPlayback(); }
                catch { }
                _videoView.SetVideoPath(localPath);
                _videoView.Start();
            });

            try
            { await Task.Delay(TimeSpan.FromSeconds(item.DurationSeconds), token); }
            catch (TaskCanceledException) { }

            _activity.RunOnUiThread(() =>
            {
                try
                { _videoView.StopPlayback(); }
                catch { }
                _videoView.Visibility = ViewStates.Gone;
            });
        }

        public async Task ShowImageAsync(ConfigItemDto item, CancellationToken token, bool isMainWindow = true)
        {
            var localPath = await _fileCache.GetCachedFilePathAsync(item.Url, item.Checksum, token);

            _activity.RunOnUiThread(() =>
            {
                _videoView.Visibility = ViewStates.Gone;
                _tableLayout.Visibility = ViewStates.Gone;
                _imageView.Visibility = ViewStates.Visible;
                try
                {
                    var bmp = Graphics.BitmapFactory.DecodeFile(localPath);
                    _imageView.SetImageBitmap(bmp);
                }
                catch
                {
                    _imageView.SetImageResource(Android.Resource.Drawable.tooltip_frame_light);
                }
            });

            try
            { await Task.Delay(TimeSpan.FromSeconds(item.DurationSeconds), token); }
            catch (TaskCanceledException) { }
        }

        public async Task ShowTableAsync(List<ExpandoObject> rows, int durationSeconds, CancellationToken token)
        {
            if (rows == null || rows.Count == 0)
            {
                // ничего не показываем
                return;
            }

            // Формируем таблицу из first row keys
            var first = rows[0] as IDictionary<string, object?>;
            var keys = new List<string>(first.Keys);

            _activity.RunOnUiThread(() =>
            {
                // Очистка
                _tableLayout.RemoveAllViews();
                // Заголовок
                var header = new TableRow(_activity);
                foreach (var k in keys)
                {
                    var tv = new TextView(_activity)
                    {
                        Text = k,
                        Typeface = Graphics.Typeface.DefaultBold,
                        CompoundDrawablePadding = 8
                    };
                    header.AddView(tv);
                }
                _tableLayout.AddView(header);

                // Строки
                foreach (IDictionary<string, object?> exp in rows)
                {
                    var r = new TableRow(_activity);
                    foreach (var k in keys)
                    {
                        var v = exp.ContainsKey(k) ? exp[k]?.ToString() ?? string.Empty : string.Empty;
                        var tv = new TextView(_activity) { Text = v, CompoundDrawablePadding = 8 };
                        r.AddView(tv);
                    }
                    _tableLayout.AddView(r);
                }

                // Показать таблицу (скролл должен быть видим)
                _tableLayout.Visibility = ViewStates.Visible;
                _imageView.Visibility = ViewStates.Gone;
                _videoView.Visibility = ViewStates.Gone;
            });

            try
            { await Task.Delay(TimeSpan.FromSeconds(durationSeconds), token); }
            catch (TaskCanceledException) { }

            // Скрываем таблицу после показа
            _activity.RunOnUiThread(() =>
            {
                _tableLayout.Visibility = ViewStates.Gone;
            });
        }

        public void Dispose()
        {
            _activity.RunOnUiThread(() =>
            {
                try
                { _videoView.StopPlayback(); }
                catch { }
            });
        }
    }
}
