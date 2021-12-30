
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace EpeolatryAPI.Entities.Inputs
{
    public class BookInsert 
    {
        public string Title { get; set; }

        public string Isbn { get; set; }

        public int PageCount { get; set; }

        public string PublishedDate { get; set; }

        public string ThumbnailUrl { get; set; }

        public string ShortDescription { get; set; }

        public string LongDescription { get; set; }

        public string Status { get; set; }

        public double Price { get; set; }

        public int Quantity { get; set; }

        public List<string> Authors { get; set; }
        
        public List<string> Categories { get; set; }
    }
}