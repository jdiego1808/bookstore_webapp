using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Responses;
using EpeolatryAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EpeolatryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BooksRepository _bookRepository;
        private readonly UsersRepository _userRepository;

        public BooksController(BooksRepository bookRepository, UsersRepository userRepository)
        {
            _bookRepository = bookRepository;
            _userRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBookAsync(string bookId, CancellationToken cancellationToken = default)
        {
            var matchedBook = await _bookRepository.GetBookAsync(bookId, cancellationToken);
            if (matchedBook == null) return BadRequest(new ErrorResponse("Not found"));
            return Ok(new BookResponse(matchedBook));
        }

        [HttpGet]
        public async Task<ActionResult> GetBooksAsync(string sort = "publishedDate", int sortDirection = -1, CancellationToken cancellationToken = default)
        {
            var books = await _bookRepository.GetBooksAsync(sort, sortDirection, cancellationToken);
            /*var bookCount = page == 0 ? await _bookRepository.GetBooksCountAsync() : -1;*/

            return Ok(new BookResponse(books, await _bookRepository.GetBooksCountAsync()));
        }

        [HttpGet("search/category")]
        public async Task<ActionResult> GetBooksByCategoryAsync(CancellationToken cancellationToken = default, [RequiredFromQuery] params string[] category)
        {
            var books = await _bookRepository.GetBooksByCategoryAsync(category: category, cancellationToken: cancellationToken);

            return Ok(new BookResponse(books, books.Count));
        }

        [HttpGet("search")]
        public async Task<ActionResult> GetBooksByTextAsync(CancellationToken cancellationToken = default, [RequiredFromQuery] params string[] text)
        {
            var books = await _bookRepository.GetBooksByTextAsync(text: text[0], cancellationToken: cancellationToken);

            return Ok(new BookResponse(books, books.Count()));
        }


        [HttpGet("config-options")]
        public ActionResult GetConfigOptions()
        {
            return Ok(new ConfigResponse(_bookRepository.GetConfig()));
        }
    }
}
