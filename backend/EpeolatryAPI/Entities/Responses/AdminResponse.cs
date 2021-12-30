using EpeolatryAPI.Entities.Projections;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Entities.Responses
{
    public class AdminResponse
    {
        [JsonProperty("statistics", NullValueHandling = NullValueHandling.Ignore)]
        public TradingStatisticsPerMonth Report { get; set; }

        [JsonProperty("transaction_list", NullValueHandling = NullValueHandling.Ignore)]
        public object UsersTransactions { get; set; }

        [JsonProperty("total_results", NullValueHandling = NullValueHandling.Ignore)]
        public long TransactionsCount { get; set; }

        public AdminResponse(IReadOnlyList<UserProjectionByTransactions> transactions, long totalTransactionsCount)
        {
            UsersTransactions = transactions;
            TransactionsCount = totalTransactionsCount;
        }

        public AdminResponse(IReadOnlyList<UserProjectionByCondTransactions> transactions, long totalTransactionsCount)
        {
            UsersTransactions = transactions;
            TransactionsCount = totalTransactionsCount;
        }

        public AdminResponse(TradingStatisticsPerMonth statistics)
        {
            Report = statistics;
        }
    }
}
