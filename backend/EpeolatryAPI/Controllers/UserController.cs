using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Responses;
using EpeolatryAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EpeolatryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        private readonly UsersRepository _userRepository;
        //private readonly CommentsRepository _commentsRepository;

        public UserController(UsersRepository usersRepository, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _userRepository = usersRepository;
            //_commentsRepository = commentsRepository;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
        }

        [HttpGet]
        public async Task<ActionResult> Get([RequiredFromQuery] string email)
        {
            var user = await _userRepository.GetUserAsync(email);
            user.AuthToken = _jwtAuthentication.Value.GenerateToken(user);
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] User user)
        {
            Dictionary<string, string> errors = new Dictionary<string, string>();
            if (user.Name.Length < 3)
            {
                errors.Add("name", "Your username must be at least 3 characters long.");
            }
            if (user.Password.Length < 8)
            {
                errors.Add("password", "Your password must be at least 8 characters long.");
            }
            if (errors.Count > 0)
            {
                return BadRequest(new { error = errors });
            }
            var response = await _userRepository.RegisterUserAsync(user.Name, user.Email, user.Password);
            if (response.User != null) response.User.AuthToken = _jwtAuthentication.Value.GenerateToken(response.User);
            if (!response.Success)
            {
                return BadRequest(new { error = response.ErrorMessage });
            }
            return Ok(response.User);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] User user)
        {
            user.AuthToken = _jwtAuthentication.Value.GenerateToken(user);
            var result = await _userRepository.LoginUserAsync(user);
            return result.User != null ? Ok(new UserResponse(result.User)) : BadRequest(result.ErrorMessage);
        }

        
        [HttpPost("logout")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Logout()
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            var result = await _userRepository.LogoutUserAsync(email);
            return Ok(result);
        }

        [HttpDelete("delete")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> Delete([FromBody] PasswordObject content)
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            var user = await _userRepository.GetUserAsync(email);
            if (!PasswordHashOMatic.Verify(content.Password, user.HashedPassword))
                return BadRequest("Provided password does not match user password.");

            return Ok(await _userRepository.DeleteUserAsync(email));
        }

        [HttpGet("cart")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetUserCartAsync(CancellationToken cancellationToken = default)
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            var response = await _userRepository.GetUserCartAsync(email, cancellationToken);
            if(response.Cart == null) return BadRequest(new UserResponse(false, "An error occured"));
            return Ok(new UserTransactionsResponse(response));
        }

        [HttpPut("cart")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> UpdateUserCartAsync([FromBody] CartInput cart, CancellationToken cancellationToken = default)
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            var response = await _userRepository.SetUserCartAsync(email, cart.Cart, cancellationToken);

            if (response.Success == true)
            {
                var user = await _userRepository.GetUserAsync(email);
                return Ok(new UserResponse(true, "Update successfully"));
            }

            return BadRequest(new UserResponse(false, response.ErrorMessage));
        }

        [HttpGet("transactions")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetUserTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            var response = await _userRepository.GetUserTransactionsAsync(email, cancellationToken);
            if(response.Transactions == null) return BadRequest(new UserResponse(false, "An error occured"));
            return Ok(new UserTransactionsResponse(response));
        }

        [HttpPut("transactions")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> UpdateUserTransactions([FromBody] Transaction tran, CancellationToken cancellationToken = default)
        {
            var email = GetUserEmailFromToken(Request);
            if (email.StartsWith("Error")) return BadRequest(email);

            tran.Date = DateTime.UtcNow;

            var response = await _userRepository.AddUserTransactionAsync(email, tran, cancellationToken);

            if (response.Success == true)
            {
                var user = await _userRepository.GetUserAsync(email);
                return Ok(new UserTransactionsResponse(user.Transactions.OrderByDescending(t => t.Date).ToList()));
            }

            return BadRequest(new UserResponse(false, response.ErrorMessage));
        }


        //// <summary>
        ///     Utility method for extracting a User's email from the JWT token.
        /// </summary>
        /// <returns>The Email of the User.</returns>
        private static string GetUserEmailFromToken(HttpRequest request)
        {
            var bearer = request.Headers.ToArray().First(h => h.Key == "Authorization").Value.First().Substring(7);

            var jwtHandler = new JwtSecurityTokenHandler();
            var readableToken = jwtHandler.CanReadToken(bearer);
            if (readableToken != true) return "Error: No bearer in the header";

            var token = jwtHandler.ReadJwtToken(bearer);
            var claims = token.Claims;

            var userEmailClaim = claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email);

            return userEmailClaim == null ? "Error: Token does not contain an email claim." : userEmailClaim.Value;
        }

        public static async Task<User> GetUserFromTokenAsync(UsersRepository _userRepository, HttpRequest request)
        {
            var email = GetUserEmailFromToken(request);
            return await _userRepository.GetUserAsync(email);
        }
    }

    public class PasswordObject
    {
        public string Password { get; set; }
    }

    public class CartInput {
        public List<Item> Cart { get; set; }
    }
}
