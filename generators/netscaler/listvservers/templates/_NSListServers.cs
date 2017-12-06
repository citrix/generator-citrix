using System;
using System.Threading.Tasks;
using System.Net.Http;

namespace <%= appName %>
{
    public partial class Program
    {
      async static Task ListVirtualServers()
        {
            //create the URI for Netscaler login
            string nsURI = string.Format(@"http://{0}:{1}/nitro/v1/config/lbvserver",NSAddress,NSPort);
            
            Console.WriteLine("Connecting to " + nsURI);
            
            //Create new http client for requests
            HttpClient _client = new HttpClient();
            _client.DefaultRequestHeaders.Add("X-NITRO-USER",NSUsername);
            _client.DefaultRequestHeaders.Add("X-NITRO-PASS",NSPassword);

            //Reading the content back from the response. This could contain an error message but for
            //simplicity, this example does trap for that.
            string _returnBody = await _client.GetStringAsync(nsURI);

            Console.WriteLine("Return value from Netscaler CPX list virtual servers API");
            Console.WriteLine(_returnBody);
        }
    }
}