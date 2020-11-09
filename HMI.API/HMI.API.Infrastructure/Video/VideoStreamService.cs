namespace HMI.API.Infrastructure.Video
{
    using System.IO;
    using System.Net.Http;
    using System.Threading.Tasks;

    /// <summary>
    /// The video stream service.
    /// </summary>
    public class VideoStreamService : IVideoStreamService
    {
        /// <summary>
        /// The client.
        /// </summary>
        private readonly HttpClient client;

        /// <summary>
        /// Initializes a new instance of the <see cref="VideoStreamService"/> class.
        /// </summary>
        public VideoStreamService()
        {
            this.client = new HttpClient();
        }

        /// <summary>
        /// Finalizes an instance of the <see cref="VideoStreamService"/> class. 
        /// </summary>
        ~VideoStreamService()
        {
            this.client?.Dispose();
        }

        /// <inheritdoc/>
        public async Task<Stream> GetVideoByName(string name)
        {
            string urlBlob;
            switch (name)
            {
                case "earth":
                    urlBlob = "https://anthonygiretti.blob.core.windows.net/videos/earth.mp4";
                    break;
                case "nature1":
                    urlBlob = "https://anthonygiretti.blob.core.windows.net/videos/nature1.mp4";
                    break;
                case "nature2":
                default:
                    urlBlob = "https://anthonygiretti.blob.core.windows.net/videos/nature2.mp4";
                    break;
            }

            return await this.client.GetStreamAsync(urlBlob);
        }
    }
}
