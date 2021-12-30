using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Inputs
{
    public class BookUpdatePriceInput
    {
        [JsonProperty("book_id")]
        public string BookId { get; set; }

        [JsonProperty("price")]
        public decimal Price { get; set; }
    }
    public class BookUpdateQtyInput
    {
        [JsonProperty("book_id")]
        public string BookId { get; set; }

        [JsonProperty("quantity")]
        public int Quantity { get; set; }
    }
}