using HMI.API.Infrastructure.Notifications;

namespace HMI.API.Services.OpcUa.ApiModels.Notifications
{

    public class NotificationModels
    {
        public NotificationModel NotificationModel { get; set; }
        public Log NotificationLogPayload { get; set; }
        // public CurrentOperationResponse NotificationOperationStatusPayload { get; set; }
    }

    public class NotificationModel
    {
        public NotificationType Type { get; set; }
    }
}
