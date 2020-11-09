using HMI.API.Infrastructure.Video;
using HMI.API.Services.Auth;
using HMI.API.Services.Items;
using HMI.API.Services.Language;
using HMI.API.SignalR;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HMI.API.Extensions
{
    /// <summary>
    /// The service extentions.
    /// </summary>
    public static class ServiceExtensions
    {
        /// <summary>
        /// The add custom services.
        /// </summary>
        /// <param name="services">The services.</param>
        /// <param name="configuration">The configuration.</param>
        /// <returns>The <see cref="IServiceCollection"/>.</returns>
        public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            // HMI.API
            services.AddTransient<INotifyClient, SignalRClientNotifier>();

            // HMI.Infraestructure
            services.AddScoped<IVideoStreamService, VideoStreamService>();

            // HMI.Services
            services.AddScoped<ItemsService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<ILanguageService, LanguageService>();
            
            services.Configure<JwtSettings>(configuration.GetSection("JWT"));

            return services;
        }
    }
}
