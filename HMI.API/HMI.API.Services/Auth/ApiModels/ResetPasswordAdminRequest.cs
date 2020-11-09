namespace HMI.API.Services.Auth.ApiModels
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// The reset password admin request.
    /// </summary>
    public class ResetPasswordAdminRequest
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        [Required]
        public string Username { get; set; }

        /// <summary>
        /// Gets or sets the new password.
        /// </summary>
        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
    }
}