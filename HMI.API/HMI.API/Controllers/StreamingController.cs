using System.Threading.Tasks;
using HMI.API.Infrastructure.Video;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMI.API.Controllers
{
    /// <summary>
    /// The streaming controller.
    /// </summary>
    [AllowAnonymous]
    [Route("streaming")]
    [ApiController]
    public class StreamingController : ControllerBase
    {
        /// <summary>
        /// The streaming service.
        /// </summary>
        private readonly IVideoStreamService streamingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="StreamingController"/> class.
        /// </summary>
        /// <param name="streamingService">
        /// The streaming service.
        /// </param>
        public StreamingController(IVideoStreamService streamingService)
        {
            this.streamingService = streamingService;
        }

        /// <summary>
        /// Get the streamming file.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        [HttpGet("{name}")]
        public async Task<FileStreamResult> Get(string name)
        {
            var stream = await this.streamingService.GetVideoByName(name);
            return new FileStreamResult(stream, "video/mp4");
        }
    }
}