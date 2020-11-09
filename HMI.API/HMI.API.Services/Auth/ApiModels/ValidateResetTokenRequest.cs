namespace HMI.API.Services.Auth.ApiModels
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// The validate reset token request.
    /// </summary>
    public class ValidateResetTokenRequest
    {
        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        [Required]
        public string Token { get; set; }
    }
}