namespace AdControl.ScreenClient.Core.Services.Abstractions
{
    public interface IQrGenerator
    {
        byte[] GeneratePng(string text, int size = 300);
    }
}
