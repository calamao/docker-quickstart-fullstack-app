namespace HMI.API.SignalR
{
    /// <summary>
    /// The NotifyClient interface.
    /// </summary>
    public interface INotifyClient
    {
        /// <summary>
        /// The notify client.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="payload">The payload.</param>
        void NotifyClient(string type, object payload);
    }
}
