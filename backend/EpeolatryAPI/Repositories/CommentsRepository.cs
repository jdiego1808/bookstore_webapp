using EpeolatryAPI.Entities;
using EpeolatryAPI.Entities.Projections;
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
    public class CommentsRepository
    {
        private readonly IMongoCollection<Comment> _commentsCollection;
        private readonly BooksRepository _booksRepository;

        public CommentsRepository(IMongoClient mongoClient)
        {
            var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);

            _commentsCollection = mongoClient.GetDatabase("bookstore").GetCollection<Comment>("comments");
            _booksRepository = new BooksRepository(mongoClient);
        }

        public async Task<Book> AddCommentAsync(User user, ObjectId bookId, string comment, CancellationToken cancellationToken = default)
        {
            try
            {
                var newComment = new Comment
                {
                    Date = DateTime.UtcNow,
                    Text = comment,
                    Name = user.Name,
                    Email = user.Email,
                    BookId = bookId
                };
                var writeConcern = new WriteConcern("majority");
                await _commentsCollection.WithWriteConcern(writeConcern).InsertOneAsync(newComment);
                
                return await _booksRepository.GetBookAsync(bookId.ToString(), cancellationToken);
            }
            catch
            {
                return null;
            }
        }

        public async Task<UpdateResult> UpdateCommentAsync(User user, ObjectId bookId, string commentId, string comment,
            CancellationToken cancellationToken = default)
        {
            UpdateResult result =  await _commentsCollection.UpdateOneAsync(
                Builders<Comment>.Filter.Where(c => 
                    c.Id == commentId 
                    && c.BookId == bookId
                    && c.Email == user.Email
                ),
                Builders<Comment>.Update.Set(c => c.Text, comment).Set(c => c.Date, DateTime.UtcNow),
                new UpdateOptions { IsUpsert = true },
                cancellationToken
            );
            return result;
        }

        public async Task<Book> DeleteCommentAsync(ObjectId bookId, string commentId,
            User user, CancellationToken cancellationToken = default)
        {
            await _commentsCollection.DeleteOneAsync(
                Builders<Comment>.Filter.Where(
                    c => c.BookId == bookId
                         && c.Id == commentId
                         && c.Email == user.Email));

            return await _booksRepository.GetBookAsync(bookId.ToString(), cancellationToken);
        }

        // Return the 10 most frequent commenters
        public async Task<TopCommentsProjection> MostActiveCommentersAsync()
        {
            try
            {
                List<ReportProjection> result = null;

                var projection = Builders<BsonDocument>.Projection.Include("count");

                result = await _commentsCollection
                    .WithReadConcern(ReadConcern.Majority)
                    .Aggregate()
                    .Group(new BsonDocument {
                        { "_id", "$email" },
                        {"count", new BsonDocument("$sum", 1)}
                    })
                    .Sort(new BsonDocument { { "count", -1 } })
                    .Limit(10)
                    .Project<ReportProjection>(projection)
                    .ToListAsync();

                return new TopCommentsProjection(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }
    }
}

