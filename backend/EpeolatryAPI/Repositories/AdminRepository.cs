using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Inputs;
using EpeolatryAPI.Entities.Projections;
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
    public class AdminRepository
    {
        private const int DefaultBooksPerPage = 20;
        private const string DefaultSortKey = "price";
        private const int DefaultSortOrder = 1;
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Book> _booksCollection;

        public AdminRepository(IMongoClient mongoClient)
        {
            var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);

            _usersCollection = mongoClient.GetDatabase("bookstore").GetCollection<User>("users");
            _booksCollection = mongoClient.GetDatabase("bookstore").GetCollection<Book>("books");
        }

        public async Task<IReadOnlyList<BookProjection>> GetBooksAsync(int booksPerPage = DefaultBooksPerPage, int page = 0,
            string sort = DefaultSortKey, int sortDirection = DefaultSortOrder, CancellationToken cancellationToken = default)
        {
            var skip = booksPerPage * page;
            var limit = booksPerPage;

            var sortFilter = new BsonDocument(sort, sortDirection);
            var books = await _booksCollection
                .Find(Builders<Book>.Filter.Empty)
                .Project(b => new BookProjection { Id = b.Id, Title=b.Title, Price=b.Price, Quantity=b.Quantity })
                .Limit(limit)
                .Skip(skip)
                .Sort(sortFilter)
                .ToListAsync(cancellationToken);

            return books;
        }

        public async Task<UpdateBookResponse> InsertBookAsync(BookInsert book, CancellationToken cancellationToken = default)
        {
            try
            {
                var newBook = new Book {
                    Title = book.Title,
                    Isbn = book.Isbn,
                    PageCount = book.PageCount,
                    PublishedDate = DateTime.Parse(book.PublishedDate),
                    ThumbnailUrl = book.ThumbnailUrl,
                    Status = book.Status,
                    ShortDescription = book.ShortDescription,
                    LongDescription = book.LongDescription,
                    Price = Convert.ToDecimal(book.Price),
                    Quantity = book.Quantity,
                    Authors = book.Authors,
                    Categories = book.Categories
                };

                var writeConcern = new WriteConcern("majority");
                await _booksCollection.WithWriteConcern(writeConcern).InsertOneAsync(newBook);
                
                return new UpdateBookResponse(true, "Book is inserted");
            }
            catch (Exception ex)
            {
                return new UpdateBookResponse(false, ex.Message);
            }
        }

        public async Task<UpdateBookResponse> UpdateBookPriceAsync(string bookId, decimal newPrice, CancellationToken cancellationToken = default)
        {
            try {
                UpdateResult result =  null;
                result = await _booksCollection.UpdateOneAsync(
                    Builders<Book>.Filter.Eq(m => m.Id, bookId),
                    Builders<Book>.Update.Set(m => m.Price, newPrice),
                    new UpdateOptions { IsUpsert = false },
                    cancellationToken
                );

                return result.MatchedCount == 0
                    ? new UpdateBookResponse(false, "No book found with that id")
                    : new UpdateBookResponse(true, result.IsAcknowledged.ToString());

            } catch(Exception e) {
                return new UpdateBookResponse(false, e.Message);
            }            
        }

        public async Task<UpdateBookResponse> UpdateBookQuantityAsync(string bookId, int qty, CancellationToken cancellationToken = default)
        {
            try {
                UpdateResult result = null;
                result = await _booksCollection.UpdateOneAsync(
                    Builders<Book>.Filter.Eq(m => m.Id, bookId),
                    Builders<Book>.Update.Set(m => m.Quantity, qty),
                    new UpdateOptions { IsUpsert = false },
                    cancellationToken
                );
                return result.MatchedCount == 0
                    ? new UpdateBookResponse(false, "No book found with that id")
                    : new UpdateBookResponse(true, result.IsAcknowledged.ToString());

            } catch(Exception e) {
                return new UpdateBookResponse(false, e.Message);
            }
        }

        public async Task<List<UserProjectionByTransactions>> GetUserTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var projection = Builders<User>.Projection.Exclude(u => u.Id)
                .Include(u => u.Email)
                .Include(u => u.Transactions);
            var trans = await _usersCollection.Find(Builders<User>.Filter.Where(u => u.IsAdmin == false))
                .Project<UserProjectionByTransactions>(projection)
                .ToListAsync();

            return trans;            
        }

        public async Task<List<UserProjectionByCondTransactions>> GetUserInProcessTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var stages = new BsonDocument[]
            {
                new BsonDocument("$unwind", 
                new BsonDocument("path", "$transactions")),
                new BsonDocument("$match", 
                new BsonDocument("transactions.status", "In process")),
                new BsonDocument("$project", 
                new BsonDocument
                    {
                        { "email", 1 }, 
                        { "transactions", 1 }
                    }),
                new BsonDocument("$group", 
                new BsonDocument
                    {
                        { "_id", "$email" }, 
                        { "transactions", 
                new BsonDocument("$push", "$transactions") }
                    })
            };

            var pipline = PipelineDefinition<User, UserProjectionByCondTransactions>.Create(stages);

            var trans = await _usersCollection.WithReadConcern(ReadConcern.Majority).Aggregate(pipline).ToListAsync();

            return trans;
        }

        public async Task<List<UserProjectionByCondTransactions>> GetUserCompletedTransactionsAsync(CancellationToken cancellationToken = default)
        {
            var stages = new BsonDocument[]
            {
                new BsonDocument("$unwind", 
                new BsonDocument("path", "$transactions")),
                new BsonDocument("$match", 
                new BsonDocument("transactions.status", "Done")),
                new BsonDocument("$project", 
                new BsonDocument
                    {
                        { "email", 1 }, 
                        { "transactions", 1 }
                    }),
                new BsonDocument("$group", 
                new BsonDocument
                    {
                        { "_id", "$email" }, 
                        { "transactions", 
                new BsonDocument("$push", "$transactions") }
                    })
            };

            var pipline = PipelineDefinition<User, UserProjectionByCondTransactions>.Create(stages);

            var trans = await _usersCollection.WithReadConcern(ReadConcern.Majority).Aggregate(pipline).ToListAsync();

            return trans;
        }

        public async Task<TradingStatisticsPerMonth> AnalyzeTransactionsPerMonth(CancellationToken cancellation = default)
        {
            var stages = new BsonDocument[]
            {
                new BsonDocument("$unwind", 
                    new BsonDocument("path", "$transactions")),
                new BsonDocument("$group", 
                    new BsonDocument
                    {
                        { "_id", 
                            new BsonDocument("$month", "$transactions.date") }, 
                        { "total_price", 
                            new BsonDocument("$sum", "$transactions.total_price") }, 
                        { "number_of_trade", 
                            new BsonDocument("$sum", 1) }
                    }),
                new BsonDocument("$sort", 
                    new BsonDocument("_id", 1))
            };
            

            var pipline = PipelineDefinition<User, TradingStatistics>.Create(stages);

            List<TradingStatistics> result = await _usersCollection
                .WithReadConcern(ReadConcern.Majority)
                .Aggregate(pipline)
                .ToListAsync();

            return new TradingStatisticsPerMonth(result);
        }

        public async Task<UpdateResult> VerifyUserTransactionsAsync(string email, DateTime date, CancellationToken cancellationToken = default)
        {
            //db.users.update({email: 'jdiego@gmail.com', 'transactions.date':{$eq: ISODate('2021-07-29T03:08:22.272Z')}}, {$set: {'transactions.$.status': 'Done'}})
            var filter = new BsonDocument
            {
                {"email", email},
                {"transactions.date", new BsonDocument("$eq", date)}
            };
            var update = new BsonDocument("$set", new BsonDocument("transactions.$.status","Done"));

            return await _usersCollection.UpdateOneAsync(
                filter,
                update,
                new UpdateOptions { IsUpsert = false },
                cancellationToken
            );
        }

    }
}
