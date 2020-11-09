using System;
using System.Collections.Generic;
using System.Linq;

using HMI.API.DataAccess.Models;
using HMI.API.Services.CustomExceptions;
using HMI.API.Services.OpcUa.ApiModels;
using HMI.API.Services.OpcUa.Interfaces;

using Microsoft.Extensions.Logging;

namespace HMI.API.Services.OpcUa.OfflineServices
{
    /// <summary>
    /// The log offline service.
    /// </summary>
    public class LogOfflineService : ILogService
    {
        /// <summary>
        /// The logger.
        /// </summary>
        private readonly ILogger<LogOfflineService> logger;

        /// <summary>
        /// The logs data.
        /// </summary>
        private IEnumerable<Log> logsData;

        /// <summary>
        /// Initializes a new instance of the <see cref="LogOfflineService"/> class.
        /// </summary>
        /// <param name="logger">
        /// The logger.
        /// </param>
        public LogOfflineService(ILogger<LogOfflineService> logger)
        {
            this.logger = logger;
            this.SeedFakeData();
        }

        /// <inheritdoc/>
        public IEnumerable<Log> GetAll(
            LogType? type,
            string code,
            DateTime? fromDate,
            DateTime? toDate,
            string module,
            bool? isAcknowledged,
            bool? orderAscending)
        {
            this.logger.LogDebug("Get all <Logs>.");

            if (fromDate != null && toDate != null && fromDate > toDate)
            {
                const string ErrorMsg = "From should be smaller than To.";
                this.logger.LogDebug(ErrorMsg);
                throw new LogEventException(ErrorMsg);
            }

            var logs = this.logsData.AsQueryable();

            if (type != null)
            {
                logs = logs.Where(l => l.Type == type);
            }

            if (code != null)
            {
                logs = logs.Where(l => l.Code == code);
            }

            if (fromDate != null)
            {
                logs = logs.Where(l => l.Date >= fromDate);
            }

            if (toDate != null)
            {
                logs = logs.Where(l => l.Date <= toDate);
            }

            if (module != null)
            {
                logs = logs.Where(l => l.Module == module);
            }

            if (isAcknowledged != null)
            {
                logs = logs.Where(l => l.IsAcknowledged == isAcknowledged);
            }

            if (orderAscending != null && orderAscending == true)
            {
                logs = logs.OrderBy(l => l.Date);
            }
            else
            {
                logs = logs.OrderByDescending(l => l.Date);
            }

            return logs;
        }

        /// <inheritdoc/>
        public Log GetById(int id)
        {
            this.logger.LogDebug($"Get <Log> by id {id}.");
            return this.GetLog(id);
        }

        /// <inheritdoc/>
        public Log SetAck(int id)
        {
            this.logger.LogDebug($"Update <Log> status by id {id}.");

            var log = this.GetLog(id);
            log.IsAcknowledged = true;

            return log;
        }

        /// <inheritdoc/>
        public void SetAckAll()
        {
            this.logger.LogDebug("Setting all logs as acknowledged.");
            this.logsData.Where(l => !l.IsAcknowledged)
                .ToList().ForEach(l => l.IsAcknowledged = true);
        }

        /// <summary>
        /// The seed fake data.
        /// </summary>
        private void SeedFakeData()
        {
            var logs = new List<Log>();
            var rnd = new Random();
            var values = Enum.GetValues(typeof(LogType));

            var start = DateTime.UtcNow.AddDays(-3);
            var range = (int)Math.Round(((TimeSpan)(DateTime.UtcNow - start)).TotalHours);

            for (var i = 1; i <= 50; i++)
            {
                var code = rnd.Next();
                logs.Add(
                    new Log
                        {
                            Id = i,
                            Type = (LogType)values.GetValue(rnd.Next(values.Length)),
                            Code = $"Code {code}",
                            IsAcknowledged = code % 2 == 0,
                            Module = $"Module {code}",
                            Title = $"Lore Ipsum Title {code}",
                            Date = start.AddHours(rnd.Next(range)),
                            Description = $"Lore Ipsum Description ${code}",
                            Actions = $"Lore Ipsum Actions {code}"
                        });
            }

            this.logsData = logs;
        }

        /// <summary>
        /// The get log.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>The <see cref="Log"/>.</returns>
        private Log GetLog(int id)
        {
            var log = this.logsData.FirstOrDefault(l => l.Id == id);
            if (log != null)
            {
                return log;
            }

            this.logger.LogDebug($"Could not find the log with Id: {id}");
            throw new KeyNotFoundException("Log not found");
        }
    }
}
