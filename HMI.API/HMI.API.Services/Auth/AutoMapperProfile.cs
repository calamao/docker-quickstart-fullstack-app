namespace HMI.API.Services.Auth
{
    using AutoMapper;

    using HMI.API.DataAccess.Models.Auth;
    using HMI.API.Services.Auth.ApiModels;

    /// <summary>
    /// The auto mapper profile.
    /// </summary>
    public class AutoMapperProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AutoMapperProfile"/> class.
        /// </summary>
        public AutoMapperProfile()
        {
            this.CreateMap<User, UserResponse>();

            this.CreateMap<User, AuthenticateResponse>();

            this.CreateMap<CreateUserRequest, User>();

            this.CreateMap<UpdateUserRequest, User>()
                .ForAllMembers(x => x.Condition(
                    (src, dest, prop) =>
                    {
                        // ignore null & empty string properties
                        if (prop == null)
                        {
                            return false;
                        }

                        return prop.GetType() != typeof(string) || !string.IsNullOrEmpty((string)prop);
                    }));
        }
    }
}
