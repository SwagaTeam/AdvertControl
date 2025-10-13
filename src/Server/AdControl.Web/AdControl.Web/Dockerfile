FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore "Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj"
RUN dotnet publish "Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5001
ENTRYPOINT ["dotnet", "AdControl.Web.dll"]

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev
WORKDIR /src
ENV ASPNETCORE_ENVIRONMENT=Development
# when building for dev we mount sources, so no COPY here is strictly required,
# but we keep a fallback copy for safety.
COPY . .
ENTRYPOINT [ "bash", "-lc", "dotnet restore \"Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj\" && dotnet build \"Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj\" && dotnet run --project \"Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj\" --urls http://+:5001" ]

