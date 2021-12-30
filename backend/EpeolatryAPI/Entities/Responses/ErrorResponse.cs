using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EpeolatryAPI.Entities.Responses
{
    public class ErrorResponse
    {
        public ErrorResponse(string errorMessage)
        {
            Error = errorMessage;
        }

        public string Error { get; set; }
    }
}
