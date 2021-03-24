using System;

using HMI.API.DataAccess.Models;
using HMI.API.Infrastructure.Notifications;
using HMI.API.Services.OpcUa.ApiModels;
using HMI.API.SignalR;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

using Moq;

using Newtonsoft.Json;

using Xunit;

namespace HMI.API.Tests
{
    /// <summary>
    /// The signal r client notifier test.
    /// </summary>
    public class SignalRClientNotifierTest
    {
        /// <summary>
        /// The hub context mock.
        /// </summary>
        private readonly Mock<IHubContext<HmiHub, IHmiTypedHubClient>> hubContextMock;

        /// <summary>
        /// The testee.
        /// </summary>
        private readonly SignalRClientNotifier testee;

        /// <summary>
        /// Initializes a new instance of the <see cref="SignalRClientNotifierTest"/> class.
        /// </summary>
        public SignalRClientNotifierTest()
        {
            this.hubContextMock = new Mock<IHubContext<HmiHub, IHmiTypedHubClient>>();
            var loggerMock = new Mock<ILogger<SignalRClientNotifier>>();
            this.testee = new SignalRClientNotifier(loggerMock.Object, this.hubContextMock.Object);
        }

        /// <summary>
        /// The notify client.
        /// </summary>
        [Fact]
        public void NotifyClient()
        {
            // Arrange
            const NotificationType Type = NotificationType.Logs;
            var payload = new Log
                              {
                                  Id = 100,
                                  Code = "Code Test",
                                  IsAcknowledged = true,
                                  Module = "Module Test",
                                  Title = "Lore Ipsum Title {Code}",
                                  Date = DateTime.UtcNow,
                                  Description = "Lore Ipsum Description Test",
                                  Actions = "Lore Ipsum Actions Test"
                              };

            this.hubContextMock.Setup(x => x.Clients.All.BroadcastMessage(It.IsAny<string>(), It.IsAny<string>()));

            // Act
            this.testee.NotifyAllClients(Type, payload);

            // Assert
            this.hubContextMock.Verify(x => x.Clients.All.BroadcastMessage(Type.ToString(), It.IsAny<string>()));
        }
    }
}
