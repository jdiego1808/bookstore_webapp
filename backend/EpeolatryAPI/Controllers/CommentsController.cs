using System;
using System.Linq;
using System.Threading.Tasks;
using EpeolatryAPI.Entities.Inputs;
using EpeolatryAPI.Entities.Responses;
using EpeolatryAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace EpeolatryAPI.Controllers
{
    /*[Route("api/[controller]")]*/
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly CommentsRepository _commentsRepository;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        private readonly UsersRepository _userRepository;

        public CommentsController(CommentsRepository commentsRepository,
            UsersRepository userRepository, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _commentsRepository = commentsRepository;
            _userRepository = userRepository;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
        }

        [HttpPost("/api/Books/comment")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> AddComment([FromBody] BookCommentInput input)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var bookId = new ObjectId(input.BookId);
            var result = await _commentsRepository.AddCommentAsync(user, bookId, input.Comment);

            return result != null ? Ok(new CommentResponse(result.Comments.OrderByDescending(d => d.Date).ToList()))
                : BadRequest(new CommentResponse());
        }

        [HttpPut("/api/Books/comment")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> UpdateCommentAsync([FromBody] BookCommentInput input)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var bookId = new ObjectId(input.BookId);
            //var commentId = new ObjectId(input.CommentId);
            var result = await _commentsRepository.UpdateCommentAsync(user, bookId, input.CommentId, input.UpdatedComment);
            
            return result.IsAcknowledged && result.ModifiedCount == 1
                ? Ok(new UserResponse(true, "Comment updated successfully"))
                : BadRequest(new UserResponse(false, "An error occurred"));
        }

        [HttpDelete("/api/Books/comment")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> DeleteCommentAsync([FromBody] BookCommentInput input)
        {
            
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var bookId = new ObjectId(input.BookId);
            //var commentId = new ObjectId(input.CommentId);
            var result = await _commentsRepository.DeleteCommentAsync(bookId, input.CommentId, user);

            return result != null
                ? (ActionResult)Ok(new CommentResponse(
                    result.Comments.OrderByDescending(d => d.Date).ToList()))
                : BadRequest(new CommentResponse());
        }
    }

}
