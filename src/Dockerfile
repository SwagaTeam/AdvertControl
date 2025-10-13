FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . . # Копируем все, включая .sln и все проекты
RUN dotnet restore "AdControl.sln" 
RUN dotnet publish "Server/AdControl.Web/AdControl.Web/AdControl.Web.csproj" -c Release -o /app/publish