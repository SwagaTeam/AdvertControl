FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "Server/AdControl.Gateway/AdControl.Gateway/AdControl.Gateway.csproj"
RUN dotnet publish "Server/AdControl.Gateway/AdControl.Gateway/AdControl.Gateway.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "AdControl.Gateway.dll"]

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /src
ENV ASPNETCORE_ENVIRONMENT=Development
COPY . .
ENTRYPOINT [ "bash", "-lc", "dotnet restore \"Server/AdControl.Gateway/AdControl.Gateway/AdControl.Gateway.csproj\" && dotnet build \"Server/AdControl.Gateway/AdControl.Gateway/AdControl.Gateway.csproj\" && dotnet run --project \"Server/AdControl.Gateway/AdControl.Gateway/AdControl.Gateway.csproj\" --urls http://+:80" ]