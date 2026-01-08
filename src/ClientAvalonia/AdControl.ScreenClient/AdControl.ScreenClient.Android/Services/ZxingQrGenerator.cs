using AdControl.ScreenClient.Core.Services.Abstractions;
using SkiaSharp;
using ZXing;

public class ZxingQrGenerator : IQrGenerator
{
    public byte[] GeneratePng(string text, int size = 300)
    {
        var writer = new ZXing.BarcodeWriterPixelData
        {
            Format = ZXing.BarcodeFormat.QR_CODE,
            Options = new ZXing.Common.EncodingOptions
            {
                Width = size,
                Height = size,
                Margin = 1
            }
        };

        var pixelData = writer.Write(text);

        var info = new SKImageInfo(
            pixelData.Width,
            pixelData.Height,
            SKColorType.Bgra8888,
            SKAlphaType.Premul);

        var rowBytes = pixelData.Width * 4;

        unsafe
        {
            fixed (byte* ptr = pixelData.Pixels)
            {
                using var pixmap = new SKPixmap(info, (nint)ptr, rowBytes);
                using var image = SKImage.FromPixels(pixmap);
                using var ms = new MemoryStream();

                image.Encode(SKEncodedImageFormat.Png, 100).SaveTo(ms);
                return ms.ToArray();
            }
        }
    }

}

