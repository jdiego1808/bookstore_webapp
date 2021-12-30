using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;

namespace EpeolatryAPI.Entities
{
    public class Comment
    {
        private string _id;

        [BsonElement("_id")]
        [JsonProperty("_id")]
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id
        {
            get { return this._id; }
            set { this._id = value; }
        }

        public string Text { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime Date { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        [BsonElement("book_id")]
        [JsonProperty("book_id")]
        [JsonIgnore]
        public ObjectId BookId { get; set; }
    }
}
