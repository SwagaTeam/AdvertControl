FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "Server/AdControl.Avalonia.Logic/AdControl.Avalonia.Logic.csproj"
RUN dotnet publish "Server/AdControl.Avalonia.Logic/AdControl.Avalonia.Logic.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5002
ENTRYPOINT ["dotnet", "AdControl.Avalonia.Logic.dll"]

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /src
ENV ASPNETCORE_ENVIRONMENT=Development
COPY . .
ENTRYPOINT [ "bash", "-lc", "dotnet restore \"Server/AdControl.Avalonia.Logic/AdControl.Avalonia.Logic.csproj\" && dotnet build \"Server/AdControl.Avalonia.Logic/AdControl.Avalonia.Logic.csproj\" && dotnet run --project \"Server/AdControl.Avalonia.Logic/AdControl.Avalonia.Logic.csproj\" --urls http://+:5002" ]
