FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["InventoryApi.csproj", "./"]
RUN dotnet restore "InventoryApi.csproj"
COPY . .
RUN dotnet build "InventoryApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InventoryApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InventoryApi.dll"]
