#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["ScanSaga/ScanSaga.csproj", "ScanSaga/"]
RUN dotnet restore "ScanSaga/ScanSaga.csproj"
COPY . .
WORKDIR "/src/ScanSaga"
RUN dotnet build "ScanSaga.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ScanSaga.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ScanSaga.dll"]