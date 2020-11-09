using System;
using System.Collections.Generic;
using System.Text;

using HMI.API.Services.OpcUa.ApiModels;
using HMI.API.Services.OpcUa.ApiModels.Module;
using HMI.API.Services.OpcUa.Interfaces;

namespace HMI.API.Services.OpcUa.OnlineServices
{
    /// <summary>
    /// The module online service.
    /// </summary>
    public class ModuleOnlineService : IModuleService
    {
        /// <inheritdoc/>
        public IEnumerable<Module> GetAll()
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public Module GetById(int id)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public CurrentOperationResponse CurrentOperation(int id)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public ProcessStatusResponse ProcessStatus(int id)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc/>
        public HardwareStatusResponse HardwareStatus(int id)
        {
            throw new NotImplementedException();
        }
    }
}
