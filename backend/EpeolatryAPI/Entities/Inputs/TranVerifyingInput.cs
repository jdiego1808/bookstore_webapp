using System;
using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Inputs
{
    public class TransactionToVerify
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("created_on")]
        public DateTime Date { get; set; }
    }
}