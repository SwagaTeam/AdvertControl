using Microsoft.AspNetCore.Http;

namespace AdControl.Gateway.Application.Extensions
{
    public static class ByteArrayExtensions
    {
        public static IFormFile ToFile(this byte[] bytes, string fileName = "file.jpg", string contentType = "image/jpeg")
        {
            if (bytes == null || bytes.Length == 0)
                return null;

            var stream = new MemoryStream(bytes);

            return new Microsoft.AspNetCore.Http.Internal.FormFile(stream, 0, bytes.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };
        }
    }
}
