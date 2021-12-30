using MongoDB.Bson;
using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Inputs
{
    public class BookCommentInput
    {
        [JsonProperty("book_id")]
        public string BookId { get; set; }

        [JsonProperty("comment_id")]
        public string CommentId { get; set; }

        public string Comment { get; set; }

        [JsonProperty("updated_comment")]
        public string UpdatedComment { get; set; }
    }
}