using System.Collections.Generic;
using EpeolatryAPI.Entities.Projections;
using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Responses
{
    public class UserResponse
    {
        public UserResponse(User user)
        {
            Success = true;
            User = user;
            AuthToken = user.AuthToken;
        }

        public UserResponse(bool success, string message)
        {
            Success = success;
            if (success) SuccessMessage = message;
            else ErrorMessage = message;
        }

        public bool Success { get; set; }
        public string SuccessMessage { get; set; }
        public string ErrorMessage { get; set; }

        [JsonProperty("auth_token")]
        public string AuthToken { get; set; }

        [JsonProperty("info")]
        public User User { get; set; }
    }

    public class UserTransactionsResponse
    {

        public string Email { get; set; }
        public List<Item> Cart { get; set; }

        public List<Transaction> Transactions { get; set; }

        public UserTransactionsResponse(UserProjectionByCart cart){
            Email = cart.Email;
            Cart = cart.Cart;
        }

        public UserTransactionsResponse(UserProjectionByTransactions trans){
            Email = trans.Email;
            Transactions = trans.Transactions;
        }
        public UserTransactionsResponse(List<Transaction> trans){
            Transactions = trans;
        }
    }
}
