using AdControl.Protos;
using Google.Protobuf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdControl.Gateway.Controllers;

[ApiController]
[Route("api/files")]
public class FileController : ControllerBase
{
    private readonly FileService.FileServiceClient _fileServiceClient;

    public FileController(FileService.FileServiceClient fileServiceClient)
    {
        _fileServiceClient = fileServiceClient;
    }

    /// <summary>
    ///     Загружает файл на сервер.
    /// </summary>
    /// <param name="file">Файл для загрузки.</param>
    /// <returns>Результат загрузки файла.</returns>
    [HttpPost("upload")]
    [Authorize]
    [ProducesResponseType(typeof(UploadFileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var extension = Path.GetExtension(file.FileName);
        var safeFileName = Path.GetFileNameWithoutExtension(file.FileName);
        var newFileName = $"{safeFileName}-{Guid.NewGuid()}{extension}";

        var request = new UploadFileRequest
        {
            FileName = newFileName,
            FileData = ByteString.CopyFrom(ms.ToArray())
        };

        var resp = await _fileServiceClient.UploadFileAsync(request);
        return Ok(resp);
    }

    /// <summary>
    ///     Возвращает файл по имени.
    /// </summary>
    /// <param name="fileName">Имя файла.</param>
    [HttpGet("{fileName}")]
    [Authorize]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string fileName)
    {
        var request = new GetFileRequest { FileName = fileName };
        var resp = await _fileServiceClient.GetFileAsync(request);

        return File(resp.FileData.ToByteArray(), "application/octet-stream", fileName);
    }

    /// <summary>
    ///     Возвращает файл по URL.
    /// </summary>
    /// <param name="url">URL файла.</param>
    [HttpGet("by-url/{*url}")]
    //[Authorize]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUrl(string url)
    {
        var decodedUrl = Uri.UnescapeDataString(url);
        var fileName = decodedUrl.Split('/').LastOrDefault();
        return await Get(fileName);
    }
}