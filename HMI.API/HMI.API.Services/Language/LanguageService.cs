using System;
using System.Collections.Generic;
using System.Linq;

using HMI.API.DataAccess.Contexts;

using Microsoft.Extensions.Logging;

using DA = HMI.API.DataAccess.Models;

namespace HMI.API.Services.Language
{
    /// <summary>
    /// The language service.
    /// </summary>
    public class LanguageService : ILanguageService
    {
        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// The context.
        /// </summary>
        private readonly ApplicationContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="LanguageService"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
        public LanguageService(ILogger<LanguageService> logger, ApplicationContext context)
        {
            this.logger = logger;
            this.context = context;
        }

        /// <inheritdoc/>
        public DA.Language CurrentActive => this.context.Languages.FirstOrDefault(l => l.IsActive);

        /// <inheritdoc/>
        public IEnumerable<DA.Language> GetAll()
        {
            this.logger.LogDebug("Get all ");
            return this.context.Set<DA.Language>();
        }

        /// <inheritdoc/>
        public DA.Language ChangeCurrentActive(int id)
        {
            this.logger.LogDebug("Changing the current language for the HMI UI.");

            var oldCurrent = this.CurrentActive;
            if (oldCurrent.Id == id)
            {
                this.logger.LogDebug("Not changes on the current language.");
                return oldCurrent;
            }

            var newCurrent = this.context.Languages.Find(id);
            if (newCurrent == null)
            {
                this.logger.LogDebug("Language not found");
                throw new KeyNotFoundException("Language not found");
            }

            oldCurrent.IsActive = false;
            this.context.Languages.Update(oldCurrent);

            newCurrent.IsActive = true;
            this.context.Languages.Update(newCurrent);

            this.context.SaveChanges();

            return newCurrent;
        }
    }
}
