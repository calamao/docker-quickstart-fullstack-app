using System.ComponentModel.DataAnnotations;

namespace HMI.API.Services.Auth.ApiModels
{
    using System.Text.Json.Serialization;

    using HMI.API.DataAccess.Models.Auth;

    /// <summary>
    /// The authenticate response.
    /// </summary>
    public class AuthenticateResponse
    {
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the role.
        /// </summary>
        [EnumDataType(typeof(Role))]
        public Role Role { get; set; }

        /// <summary>
        /// Gets or sets the jwt token.
        /// </summary>
        public string JwtToken { get; set; }

        /// <summary>
        /// Gets or sets the refresh token.
        /// </summary>
        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }
    }
}