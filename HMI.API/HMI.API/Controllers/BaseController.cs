using HMI.API.Helpers.Pagination;

using Microsoft.AspNetCore.Mvc;

namespace HMI.API.Controllers
{
    /// <summary>
    /// The base controller.
    /// </summary>
    public class BaseController : ControllerBase
    {
        /// <summary>
        /// The requester id.
        /// </summary>
        public int RequesterId => (int)this.HttpContext.Items["RequesterId"];
    }
}
