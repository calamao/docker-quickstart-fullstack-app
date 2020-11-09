using System.Collections.Generic;

using HMI.API.DataAccess.Models;
using HMI.API.Helpers;
using HMI.API.Services.Language;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HMI.API.Controllers
{
    /// <summary>
    /// The language controller.
    /// </summary>
    [Route("language")]
    [ApiController]
    public class LanguageController : ControllerBase
    {
        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger<LanguageController> logger;

        /// <summary>
        /// The language service.
        /// </summary>
        private readonly ILanguageService languageService;

        /// <summary>
        /// Initializes a new instance of the <see cref="LanguageController"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="languageService">The language Service.</param>
        public LanguageController(ILogger<LanguageController> logger, ILanguageService languageService)
        {
            this.logger = logger;
            this.languageService = languageService;
        }

        /// <summary>
        /// The get all.
        /// </summary>
        /// <returns>The list of the available languages for the UI.</returns>
        /// <response code="200">Returns list of all available languages for the UI.</response>
        /// <response code="500">An internal error occurred.</response>
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<Language>> GetAll()
        {
            this.logger.LogDebug("Get all available language request received.");
            return this.Ok(this.languageService.GetAll());
        }

        /// <summary>
        /// The current active language.
        /// </summary>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        /// <response code="200">Returns list of all available languages for the UI.</response>
        /// <response code="500">An internal error occurred.</response>
        [HttpGet("current-active/")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> CurrentActive()
        {
            this.logger.LogDebug("Get current available language request received.");
            return this.Ok(this.languageService.CurrentActive);
        }

        /// <summary>
        /// The change current active.
        /// </summary>
        /// <param name="id" example="1">The unique identifyer.</param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        /// <response code="200">Returns list of all available languages for the UI.</response>
        /// <response code="404">If the language for the specified id does not exist.</response>  
        /// <response code="500">An internal error occurred.</response>
        [HttpPut("current-active/{id:int}")]
        [Authorize]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
        public ActionResult<Language> ChangeCurrentActive(int id)
        {
            this.logger.LogDebug("Change current available language request received.");
            return this.Ok(this.languageService.ChangeCurrentActive(id));
        }
    }
}
