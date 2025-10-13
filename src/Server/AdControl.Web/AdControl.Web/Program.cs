using AdControl.Application.Repository.Abstractions;
using AdControl.Application.Services.Abstractions;
using AdControl.Application.Services.Implementations;
using AdControl.Core.Infrastructure.Repository.Implementations;
using AdControl.Core.Persistence;
using AdControl.Web.Services;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Kestrel: слушаем нужный порт и разрешаем HTTP/2
builder.WebHost.ConfigureKestrel(options =>
{
    var port = int.TryParse(Environment.GetEnvironmentVariable("ASPNETCORE_PORT"), out var p) ? p : 5001;
    options.ListenAnyIP(port, listenOptions => { listenOptions.Protocols = HttpProtocols.Http1AndHttp2; });
});

// configuration
var conn = builder.Configuration.GetConnectionString("DefaultConnection")
           ?? "Host=postgres;Port=5432;Database=adcontrol;Username=aduser;Password=secret";

// EF DbContext
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(conn));

// register application services
builder.Services.AddScoped<IScreenRepository, ScreenRepository>();
builder.Services.AddScoped<IConfigRepository, ConfigRepository>();
builder.Services.AddScoped<IScreenService, ScreenService>();
builder.Services.AddScoped<IConfigService, ConfigService>();

// gRPC
builder.Services.AddGrpc();

var app = builder.Build();

// Ensure DB created (dev convenience). Use migrations in prod.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.MapGrpcService<GrpcScreenService>();
app.MapGet("/", () => "AdControl.Web gRPC running");

app.Run();