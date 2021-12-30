using EpeolatryAPI.Entities;
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
    public class UsersRepository
    {
        private readonly IMongoCollection<Session> _sessionsCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public UsersRepository(IMongoClient mongoClient)
        {
            var camelCaseConvention = new ConventionPack { new CamelCaseElementNameConvention() };
            ConventionRegistry.Register("CamelCase", camelCaseConvention, type => true);

            _usersCollection = mongoClient.GetDatabase("bookstore").GetCollection<User>("users");
            _sessionsCollection = mongoClient.GetDatabase("bookstore").GetCollection<Session>("sessions");
        }

        public async Task<User> GetUserAsync(string email, CancellationToken cancellationToken = default)
        {
            return await _usersCollection.Find(Builders<User>.Filter.Eq(u => u.Email, email))
                    .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<UserResponse> RegisterUserAsync(string name, string email, string password,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var user = new User
                {
                    Name = name,
                    Email = email,
                    HashedPassword = PasswordHashOMatic.Hash(password),
                    IsAdmin = false,
                    Cart = new List<Item>(),
                    Transactions = new List<Transaction>()
                };
                var writeConcern = new WriteConcern("majority");
                await _usersCollection.WithWriteConcern(writeConcern).InsertOneAsync(user);

                var newUser = await GetUserAsync(user.Email, cancellationToken);
                return new UserResponse(newUser);
            }
            catch (Exception ex)
            {
                return ex.Message.StartsWith("MongoError: E11000 duplicate key error")
                    ? new UserResponse(false, "A user with the given email already exists.")
                    : new UserResponse(false, ex.Message);
            }
        }

        public async Task<UserResponse> LoginUserAsync(User user, CancellationToken cancellationToken = default)
        {
            try
            {
                var storedUser = await GetUserAsync(user.Email, cancellationToken);
                if (storedUser == null)
                {
                    return new UserResponse(false, "No user found. Please check the email address.");
                }
                if (user.HashedPassword != null && user.HashedPassword != storedUser.HashedPassword)
                {
                    return new UserResponse(false, "The hashed password provided is not valid");
                }
                if (user.HashedPassword == null && !PasswordHashOMatic.Verify(user.Password, storedUser.HashedPassword))
                {
                    return new UserResponse(false, "The password provided is not valid");
                }

                await _sessionsCollection.UpdateOneAsync(
                    new BsonDocument("user_id", user.Email),
                    Builders<Session>.Update.Set(s => s.UserId, user.Email).Set(s => s.Jwt, user.AuthToken),
                    new UpdateOptions { IsUpsert = true });

                storedUser.AuthToken = user.AuthToken;
                return new UserResponse(storedUser);
            }
            catch (Exception ex)
            {
                return new UserResponse(false, ex.Message);
            }
        }

        public async Task<UserResponse> LogoutUserAsync(string email, CancellationToken cancellationToken = default)
        {
            await _sessionsCollection.DeleteOneAsync(new BsonDocument("user_id", email), cancellationToken);
            return new UserResponse(true, "User logged out.");
        }

        public async Task<Session> GetUserSessionAsync(string email, CancellationToken cancellationToken = default)
        {
            return await _sessionsCollection.Find(new BsonDocument()).FirstOrDefaultAsync();
        }

        public async Task<UserResponse> DeleteUserAsync(string email, CancellationToken cancellationToken = default)
        {
            try
            {
                await _usersCollection.DeleteOneAsync(new BsonDocument("email", email), cancellationToken);
                await _sessionsCollection.DeleteOneAsync(new BsonDocument("user_id", email), cancellationToken);

                var deletedUser = await _usersCollection.FindAsync<User>(new BsonDocument("email", email),
                    cancellationToken: cancellationToken);
                var deletedSession = await _sessionsCollection.FindAsync<Session>(new BsonDocument("user_id", email),
                    cancellationToken: cancellationToken);
                if (deletedUser.FirstOrDefault() == null && deletedSession.FirstOrDefault() == null)
                    return new UserResponse(true, "User deleted");
                return new UserResponse(false, "User deletion was unsuccessful");
            }
            catch (Exception ex)
            {
                return new UserResponse(false, ex.ToString());
            }
        }

        public async Task<UserProjectionByCart> GetUserCartAsync(string email, CancellationToken cancellationToken = default)
        {
            var projection = Builders<User>.Projection.Include(u => u.Cart).Include(u => u.Email).Exclude(u => u.Id);

            return await _usersCollection.Find(Builders<User>.Filter.Eq(u => u.Email, email))
                .Project<UserProjectionByCart>(projection)
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<UserResponse> SetUserCartAsync(string email, List<Item> cart, CancellationToken cancellationToken = default)
        {
            try
            {
                UpdateResult updateResult = await _usersCollection.UpdateOneAsync(
                    new BsonDocument("email", email),
                    Builders<User>.Update.Set("cart", cart),
                    new UpdateOptions { IsUpsert = false },
                    cancellationToken);

                return updateResult.MatchedCount == 0
                    ? new UserResponse(false, "No user found with that email")
                    : new UserResponse(true, updateResult.IsAcknowledged.ToString());
            }
            catch (Exception e)
            {
                return new UserResponse(false, e.Message);
            }
        }

        public async Task<UserProjectionByTransactions> GetUserTransactionsAsync(string email, CancellationToken cancellationToken = default)
        {
            var projection = Builders<User>.Projection.Include(u => u.Transactions).Include(u => u.Email).Exclude(u => u.Id);
            
            return await _usersCollection.Find(Builders<User>.Filter.Eq(u => u.Email, email))
                .Project<UserProjectionByTransactions>(projection)
                .FirstOrDefaultAsync(cancellationToken);
        }
        public async Task<UserResponse> AddUserTransactionAsync(string email, Transaction tran, CancellationToken cancellationToken = default)
        {
            try
            {
                UpdateResult updateResult = await _usersCollection.UpdateOneAsync(
                    new BsonDocument("email", email),
                    Builders<User>.Update.AddToSet("transactions", tran),
                    new UpdateOptions { IsUpsert = false },
                    cancellationToken);

                return updateResult.MatchedCount == 0
                    ? new UserResponse(false, "No user found with that email")
                    : new UserResponse(true, updateResult.IsAcknowledged.ToString());
            }
            catch (Exception e)
            {
                return new UserResponse(false, e.Message);
            }
        }
    }
}
