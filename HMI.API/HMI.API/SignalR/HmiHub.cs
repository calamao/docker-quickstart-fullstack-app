using Microsoft.AspNetCore.SignalR;

namespace HMI.API.SignalR
{
    /// <summary>
    /// The hmi hub.
    /// </summary>
    public class HmiHub : Hub<IHmiTypedHubClient>
    {
    }
}
