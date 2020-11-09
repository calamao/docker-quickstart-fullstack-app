using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

namespace HMI.API.SignalR
{
    /// <summary>
    /// The signal r client notifier.
    /// </summary>
    public class SignalRClientNotifier : INotifyClient
    {
        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger<SignalRClientNotifier> logger;

        /// <summary>
        /// The hub context.
        /// </summary>
        private readonly IHubContext<HmiHub, IHmiTypedHubClient> hubContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalRClientNotifier"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="hubContext">The hub context. </param>
        public SignalRClientNotifier(
            ILogger<SignalRClientNotifier> logger,
            IHubContext<HmiHub, IHmiTypedHubClient> hubContext)
        {
            this.logger = logger;
            this.hubContext = hubContext;
        }

        /// <summary>
        /// The notify client.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="payload">The payload.</param>
        public void NotifyClient(string type, object payload)
        {
            this.logger.LogInformation($"Notifying changes to all clients. Type:{type} Payload: {payload}");

            var stringPayload = JsonConvert.SerializeObject(payload);
            this.hubContext.Clients.All.BroadcastMessage(type, stringPayload);
        }
    }
}
