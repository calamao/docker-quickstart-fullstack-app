namespace HMI.API.Infrastructure.Video
{
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// The VideoStreamService interface.
    /// </summary>
    public interface IVideoStreamService
    {
        /// <summary>
        /// The get video by name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        Task<Stream> GetVideoByName(string name);
    }
}