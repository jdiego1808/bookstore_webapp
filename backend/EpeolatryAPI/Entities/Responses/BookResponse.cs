using EpeolatryAPI.Entities.Projections;
using MongoDB.Bson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Entities.Responses
{
    public class BookResponse
    {
        private static readonly int BOOKS_PER_PAGE = 20;

        [JsonProperty("book", NullValueHandling = NullValueHandling.Ignore)]
        public Book Book { get; set; }

        [JsonProperty("books", NullValueHandling = NullValueHandling.Ignore)]
        public object Books { get; set; }

        /*[JsonProperty("titles", NullValueHandling = NullValueHandling.Ignore)]
        public List<KeyValuePair<ObjectId, string>> Titles { get; set; }*/

        [JsonProperty("total_results", NullValueHandling = NullValueHandling.Ignore)]
        public long BooksCount { get; set; }

        [JsonProperty("page", NullValueHandling = NullValueHandling.Ignore)]
        public int Page { get; set; }

        [JsonProperty("entriesPerPage", NullValueHandling = NullValueHandling.Ignore)]
        public int EntriesPerPage { get; set; }

/*        [JsonProperty("filters", NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, object> Filters { get; set; }

        [JsonProperty("api", NullValueHandling = NullValueHandling.Ignore)]
        public string Api { get; set; }*/

        public BookResponse(Book book)
        {
            if (book != null)
            {
                Book = book;
            }
        }

        public BookResponse(IReadOnlyList<Book> books, long totalBookCount)
        {
            Books = books;
            BooksCount = totalBookCount;
        }

        public BookResponse(IReadOnlyList<BookProjection> books, long totalBookCount, int page)
        {
            Books = books;
            BooksCount = totalBookCount;
            EntriesPerPage = BOOKS_PER_PAGE;
            Page = page;
        }
    }
}
