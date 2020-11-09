using System.Threading.Tasks;

namespace HMI.API.SignalR
{
    /// <summary>
    /// The HmiTypedHubClient interface.
    /// </summary>
    public interface IHmiTypedHubClient
    {
        /// <summary>
        /// The broadcast message.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="payload">The payload.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        Task BroadcastMessage(string type, string payload);
    }
}