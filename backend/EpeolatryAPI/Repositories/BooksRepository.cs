using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Responses;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EpeolatryAPI.Repositories
{
    public class BooksRepository
    {
        private const int DefaultBooksPerPage = 20;
        private const string DefaultSortKey = "publishedDate";
        private const int DefaultSortOrder = -1;
        private readonly IMongoCollection<Book> _booksCollection;
        private readonly IMongoCollection<Comment> _commentsCollection;
        private readonly IMongoClient _mongoClient;

        public BooksRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);

            _booksCollection = mongoClient.GetDatabase("bookstore").GetCollection<Book>("books");
            _commentsCollection = mongoClient.GetDatabase("bookstore").GetCollection<Comment>("comments");
        }

        public async Task<IReadOnlyList<Book>> GetBooksAsync(string sort = DefaultSortKey, int sortDirection = DefaultSortOrder,
            CancellationToken cancellationToken = default)
        {
            var sortFilter = new BsonDocument(sort, sortDirection);
            var books = await _booksCollection
                .Find(Builders<Book>.Filter.Empty)
                .Sort(sortFilter)
                .ToListAsync(cancellationToken); // query the database for all books

            return books;
        }

        public async Task<Book> GetBookAsync(string bookId, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _booksCollection.Aggregate()
                    .Match(Builders<Book>.Filter.Eq(m => m.Id, bookId))
                    .Lookup(
                        _commentsCollection,
                        m => m.Id,
                        c => c.BookId,
                        (Book m) => m.Comments
                    )
                    .FirstOrDefaultAsync(cancellationToken);

                /*return await _booksCollection.Find(Builders<Book>.Filter.Eq(b => b.Id, bookId))
                    .FirstOrDefaultAsync(cancellationToken); */               
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("is not a valid 24 digit hex string") ||
                    ex.Message.Contains("not valid characters") ||
                    ex.Message.Contains("null id") ||
                    ex.Message.Contains("not exist")) return null;
                throw;
            }
        }

        public async Task<Book> GetBookByIsbnAsync(string isbn, CancellationToken cancellationToken = default)
        {
            return await _booksCollection.Find(Builders<Book>.Filter.Eq(m => m.Isbn, isbn))
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Book>> GetBooksByTextAsync(string text, CancellationToken cancellationToken = default)
        {

            var books = await _booksCollection
                .Find(Builders<Book>.Filter.Text(text))
                .ToListAsync(cancellationToken);

            return books;
        }

        public async Task<IReadOnlyList<Book>> GetBooksByCategoryAsync(string[] category, CancellationToken cancellationToken = default)
        {
            var books = await _booksCollection
                .Find(Builders<Book>.Filter.In("categories", category))
                .ToListAsync(cancellationToken);

            return books;
        }

        public async Task<long> GetBooksCountAsync()
        {
            return await _booksCollection.CountDocumentsAsync(Builders<Book>.Filter.Empty);
        }

        public ConfigInfo GetConfig()
        {
            var settings = _mongoClient.Settings;

            var command = new JsonCommand<ConfigInfo>("{ connectionStatus: 1, showPrivileges: true }");
            var authInfo = _commentsCollection.Database.RunCommand(command);

            authInfo.Settings = settings;
            return authInfo;
        }

    }
}
