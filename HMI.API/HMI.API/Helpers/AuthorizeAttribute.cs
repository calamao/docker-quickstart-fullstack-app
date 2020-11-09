using System;
using System.Collections.Generic;
using System.Linq;

using HMI.API.DataAccess.Models.Auth;
using HMI.API.Services.CustomExceptions;

using Microsoft.AspNetCore.Mvc.Filters;

namespace HMI.API.Helpers
{

    /// <summary>
    /// The authorize attribute.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        /// <summary>
        /// The roles.
        /// </summary>
        private readonly IList<Role> roles;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorizeAttribute"/> class.
        /// </summary>
        /// <param name="roles">
        /// The roles.
        /// </param>
        public AuthorizeAttribute(params Role[] roles)
        {
            this.roles = roles ?? new Role[] { };
        }

        /// <summary>
        /// The on authorization.
        /// </summary>
        /// <param name="context">The context.</param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var requesterRole = context.HttpContext.Items["RequesterRole"];

            // not logged in or role not authorized
            if (requesterRole == null)
            {
                throw new UnauthorizedException("Please authenticate before perform this action.");
            }

            if (this.roles.Any() && !this.roles.Contains((Role)requesterRole))
            {
                throw new ForbiddenException("Do not have enough privileges to perform this action.");
            }
        }
    }
}
