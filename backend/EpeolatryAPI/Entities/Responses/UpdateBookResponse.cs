using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Responses
{
    public class UpdateBookResponse
    {

        public UpdateBookResponse(bool success, string message)
        {
            Success = success;
            if (success) SuccessMessage = message;
            else ErrorMessage = message;
        }

        public bool Success { get; set; }
        public string SuccessMessage { get; set; }
        public string ErrorMessage { get; set; }
    }
}
