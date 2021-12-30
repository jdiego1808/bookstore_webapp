using EpeolatryAPI.Entities.Inputs;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EpeolatryAPI.Entities
{
    public class Book
    {
        private List<Comment> comments;
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

        public string Title { get; set; }

        public string Isbn { get; set; }

        public int PageCount { get; set; }

        public DateTime PublishedDate { get; set; }

        public string ThumbnailUrl { get; set; }

        public string ShortDescription { get; set; }

        public string LongDescription { get; set; }

        public string Status { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public List<string> Authors { get; set; }
        
        public List<string> Categories { get; set; }

        public List<Comment> Comments
        {
            get { return comments != null ? comments.OrderByDescending(c => c.Date).ToList() : new List<Comment>(); }
            set => comments = value;
        }

        [BsonElement("num_comments")]
        public int NumberOfComments { get; set; }
    }
}
