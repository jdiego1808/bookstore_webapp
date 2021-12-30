using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Entities.Projections
{
    public class UserProjectionByCart
    {
        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("cart")]
        public List<Item> Cart { get; set; }
    }
    public class UserProjectionByTransactions
    {
        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("transactions")]
        public List<Transaction> Transactions { get; set; }
    }

    public class UserProjectionByCondTransactions
    {
        [BsonElement("_id")]
        public string Email { get; set; }

        [BsonElement("transactions")]
        public List<Transaction> Transactions { get; set; }
    }
}
