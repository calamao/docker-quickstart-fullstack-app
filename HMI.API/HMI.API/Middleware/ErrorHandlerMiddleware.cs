using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

using HMI.API.Helpers;
using HMI.API.Services.CustomExceptions;

using Microsoft.AspNetCore.Http;

namespace HMI.API.Middleware
{
    /// <summary>
    /// The error handler middleware.
    /// </summary>
    public class ErrorHandlerMiddleware
    {
        /// <summary>
        /// The next.
        /// </summary>
        private readonly RequestDelegate next;

        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorHandlerMiddleware"/> class.
        /// </summary>
        /// <param name="next">
        /// The next.
        /// </param>
        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        /// <summary>
        /// The invoke.
        /// </summary>
        /// <param name="context">The http context.</param>
        /// <returns>The result.</returns>
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await this.next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";

                switch (error)
                {
                    case AuthenticationException _:
                    case LogEventException _:
                    case UserException _:
                    case ApiException _:
                        // custom application error
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        break;
                    case UnauthorizedException _:
                        response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        break;
                    case KeyNotFoundException _:
                        // not found error
                        response.StatusCode = (int)HttpStatusCode.NotFound;
                        break;
                    case ForbiddenException _:
                        response.StatusCode = (int)HttpStatusCode.Forbidden;
                        break;
                    default:
                        // unhandled error
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }

                var result = JsonSerializer.Serialize(new ErrorResponse { Message = error?.Message });
                await response.WriteAsync(result);
            }
        }
    }
}