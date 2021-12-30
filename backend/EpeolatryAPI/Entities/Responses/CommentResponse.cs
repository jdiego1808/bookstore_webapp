using EpeolatryAPI.Entities.Projections;
using System.Collections.Generic;

namespace EpeolatryAPI.Entities.Responses
{
    public class CommentResponse
    {
        public CommentResponse()
        {
            Comments = new List<Comment>();
            TopCommenters = new List<TopCommentsProjection>();
        }
        public CommentResponse(List<Comment> comments)
        {
            Comments = comments;
        }

        public CommentResponse(IReadOnlyList<TopCommentsProjection> commenters)
        {
            TopCommenters = commenters;
        }

        public List<Comment> Comments { get; set; }
        public IReadOnlyList<TopCommentsProjection> TopCommenters { get; set; }
    }
}
