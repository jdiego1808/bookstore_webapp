using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Entities
{
    public class TradingStatisticsPerMonth
    {
        [BsonElement("statistics")]
        public List<TradingStatistics> Statistics { get; set; }

        public TradingStatisticsPerMonth(List<TradingStatistics> tradingStatistics)
        {
            Statistics = tradingStatistics;
        }
    }

    public class TradingStatistics
    {
        [BsonElement("_id")]
        public int Month { get; set; }

        [BsonElement("total_price")]
        public decimal TotalPrice { get; set; }

        [BsonElement("number_of_trade")]
        public int NumOfTrade { get; set; }


    }
}
