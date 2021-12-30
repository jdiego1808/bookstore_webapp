using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Inputs;
using EpeolatryAPI.Entities.Responses;
using EpeolatryAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EpeolatryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;
        private readonly AdminRepository _adminRepository;
        private readonly UsersRepository _userRepository;
        private readonly BooksRepository _booksRepository;

        public AdminController(AdminRepository adminRepository, UsersRepository userRepository, BooksRepository booksRepository, IOptions<JwtAuthentication> jwtAuthentication)
        {
            _adminRepository = adminRepository;
            _userRepository = userRepository;
            _booksRepository = booksRepository;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
        }

        [HttpGet("books")]
        public async Task<ActionResult> GetBooksAsync(int limit = 20, [FromQuery(Name = "page")] int page = 0,
            string sort = "price", int sortDirection = 1, CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error") && user.IsAdmin == false) return BadRequest(user.Email);

            var books = await _adminRepository.GetBooksAsync(limit, page, sort, sortDirection, cancellationToken);
            var count = await _booksRepository.GetBooksCountAsync();
            return Ok(new BookResponse(books, count, page));
        }

        [HttpPost("books")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> InsertBookAsync([FromBody] BookInsert input, CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error") && user.IsAdmin == false) return BadRequest(user.Email);
            
            Console.WriteLine("input: " + input.Categories.Count + " --- " + input.Authors.Count);
            
            var res = await _adminRepository.InsertBookAsync(input, cancellationToken);
            if (res.Success)
            {
                var insertedBook = await _booksRepository.GetBookByIsbnAsync(input.Isbn);
                return Ok(new BookResponse(insertedBook));
            }

            return BadRequest(new UpdateBookResponse(false, res.ErrorMessage));
        }

        [HttpPut("books/{bookId}/update-price")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> UpdateBookPriceAsync([FromBody] BookUpdatePriceInput input)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error") && user.IsAdmin == false) return BadRequest(user.Email);
            
            var bookId = input.BookId;
            var price = input.Price;

            var response = await _adminRepository.UpdateBookPriceAsync(bookId, price);
            
            if (response.Success == true)
            {
                var book = await _booksRepository.GetBookAsync(bookId);
                return Ok(new BookResponse(book));
            }

            return BadRequest(new UpdateBookResponse(false, ""));
            
        }

        [HttpPut("books/{bookId}/update-quantity")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> UpdateBookQuantityAsync([FromBody] BookUpdateQtyInput input)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error") && user.IsAdmin == false) return BadRequest(user.Email);
            
            var bookId = input.BookId;
            var qty = input.Quantity;
            
            var response = await _adminRepository.UpdateBookQuantityAsync(bookId, qty);
            
            if (response.Success == true)
            {
                var book = await _booksRepository.GetBookAsync(bookId);
                return Ok(new BookResponse(book));
            }

            return BadRequest(new UserResponse(false, ""));
        }

        [HttpGet("transactions")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetUserTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var trans = await _adminRepository.GetUserTransactionsAsync(cancellationToken);
            var count = 0;
            trans.ForEach(t => count += t.Transactions.Count);

            return Ok(new AdminResponse(trans, count));
        }

        [HttpPut("transactions/verify")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> VerifyUserTransactionAsync([FromBody] TransactionToVerify input, CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error") && user.IsAdmin == false) return BadRequest(user.Email);

            var email = input.Email;
            var date = input.Date;

            var result = await _adminRepository.VerifyUserTransactionsAsync(email, date);
            
            if(result.IsAcknowledged && result.ModifiedCount==1) {
                var trans = await _adminRepository.GetUserTransactionsAsync(cancellationToken);
                return Ok(new AdminResponse(trans, trans.Count));
            }

            return BadRequest(new BsonDocument("status", "error"));

        }

        [HttpGet("transactions/in-process")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetUserInProcessTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var trans = await _adminRepository.GetUserInProcessTransactionsAsync(cancellationToken);

            return Ok(new AdminResponse(trans, trans.Count));
        }

        [HttpGet("transactions/completed")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetUserCompletedTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var trans = await _adminRepository.GetUserCompletedTransactionsAsync(cancellationToken);

            return Ok(new AdminResponse(trans, trans.Count));
        }

        [HttpGet("transactions/analyze")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> GetAnalyzedTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var user = await UserController.GetUserFromTokenAsync(_userRepository, Request);
            if (user.Email.StartsWith("Error")) return BadRequest(user.Email);

            var report = await _adminRepository.AnalyzeTransactionsPerMonth(cancellationToken);

            return Ok(new AdminResponse(report));
        }

    }
    
}
