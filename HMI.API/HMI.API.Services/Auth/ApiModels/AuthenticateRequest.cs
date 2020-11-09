namespace HMI.API.Services.Auth.ApiModels
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Request to authenticate user into the web Api. 
    /// </summary>
    public class AuthenticateRequest
    {
        /// <summary>
        /// Gets or sets the username of the user who wants to be authenticated. 
        /// </summary>
        [Required]
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the password of the user who wants to be authenticated. 
        /// </summary>
        [Required]
        public string Password { get; set; }
    }
}