using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace EpeolatryAPI.Entities.Projections
{
    public class TopCommentsProjection
    {
        public TopCommentsProjection(List<ReportProjection> report)
        {
            this.Report = report;
        }

        [BsonElement("report")]
        public List<ReportProjection> Report { get; set; }
    }

    public class ReportProjection
    {
        [BsonElement("_id")]
        public string Id { get; set; }

        public int Count { get; set; }
    }
}
