#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

# This image works for Windows and Linux
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src

COPY "HMI.API/HMI.sln" "./HMI.API/"

COPY "HMI.API/HMI.API/*.csproj" "HMI.API/HMI.API/"
COPY "HMI.API/Tests/HMI.API.Tests/*.csproj" "HMI.API/Tests/HMI.API.Tests/"
COPY "HMI.API/HMI.API.DataAccess/*.csproj" "HMI.API/HMI.API.DataAccess/"
COPY "HMI.API/HMI.API.Services/*.csproj" "HMI.API/HMI.API.Services/"
COPY "HMI.API/HMI.API.Infrastructure/*.csproj" "HMI.API/HMI.API.Infrastructure/"

RUN dotnet restore "HMI.API/HMI.sln"

COPY . .
WORKDIR "/src/HMI.API"
RUN dotnet build "HMI.API/HMI.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HMI.API/HMI.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HMI.API.dll"]