﻿using System;

using HMI.API.DataAccess.Models;
using HMI.API.Infrastructure.Notifications;
using HMI.API.Services.OpcUa.ApiModels;
using HMI.API.SignalR;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HMI.API.Controllers
{
    /// <summary>
    /// The developer controller.
    /// </summary>
    [Route("dev")]
    [ApiController]
    public class DeveloperController : BaseController
    {
        /// <summary>
        /// The notify client.
        /// </summary>
        private readonly INotifyClient notifyClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="DeveloperController"/> class.
        /// </summary>
        /// <param name="notifyClient">
        /// The notify client.
        /// </param>
        public DeveloperController(INotifyClient notifyClient)
        {
            this.notifyClient = notifyClient;
        }

        /// <summary>
        /// Send a SignalR notification for Logs.
        /// </summary>
        /// <returns>
        /// The <see cref="IActionResult"/>.
        /// </returns>
        [HttpPost("signalR-log-notification")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SignalRLogNotification()
        {
            const int Code = 1255489;
            var log = new Log
                          {
                              Id = 1,   // match with a real logId so it can be visualized later
                              Code = $"Code {Code}",
                              IsAcknowledged = true,
                              Module = $"Module {Code}",
                              Title = $"Lore Ipsum Title {Code}",
                              Date = DateTime.UtcNow,
                              Description = $"Lore Ipsum Description ${Code}",
                              Actions = $"Lore Ipsum Actions {Code}"
                          };
            this.notifyClient.NotifyAllClients(NotificationType.Logs, log);
            return this.Ok();
        }

        /// <summary>
        /// The SignalR any notification.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="payload">The payload.</param>
        /// <returns>The <see cref="IActionResult"/>.</returns>
        [HttpPost("signalR-any-notification")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult SignalRAnyNotification(NotificationType type, string payload)
        {
            this.notifyClient.NotifyAllClients(type, payload);
            return this.Ok();
        }
    }
}
