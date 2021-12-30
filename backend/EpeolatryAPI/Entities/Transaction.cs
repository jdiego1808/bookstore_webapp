using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace EpeolatryAPI.Entities
{
    public class Transaction
    {
        public List<Item> Items { get; set; }

        [BsonElement("total_price")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal TotalPrice { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime Date { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public string Status { get; set; }
    }
    public class Item
    {
        [BsonElement("book_id")]
        [JsonProperty("book_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        //[JsonIgnore]
        public string BookId { get; set; }

        public string Title { get; set; }

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; }

        public int Quantity { get; set; }
    }
}
/*
 transactions: [
 {
    items: [{"bookId": "abscafusbvoiwi", "quantity": 2}, {"bookId": "abscafusbvoiwi", "quantity": 2}]
    totalPrice: 291.99,
    date: 2021-07-30
 },
{
    items: [{"bookId": "abscafusbvoiwi", "quantity": 2}, {"bookId": "abscafusbvoiwi", "quantity": 2}]
    totalPrice: 291.99,
    date: 2021-07-30
 }
]
 */
/*
 cart: [
    {bookId: "abaiuasasgs", quantity: 2},
    {bookId: "abaiuasasgs", quantity: 2}
    ]
 */