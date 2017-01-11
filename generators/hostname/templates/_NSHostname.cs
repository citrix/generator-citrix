using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;

namespace <%= appName %>
{
    public partial class Program
    {
        async static Task ListHostname()
        {
            //create the URI for Netscaler login
            string nsURI = string.Format(@"http://{0}:{1}/nitro/v1/config/nshostname",NSAddress,NSPort);
            
            Console.WriteLine("Connecting to " + nsURI);
            
            //Create new http client for requests
            HttpClient _client = new HttpClient();
            _client.DefaultRequestHeaders.Add("X-NITRO-USER",NSUsername);
            _client.DefaultRequestHeaders.Add("X-NITRO-PASS",NSPassword);

            //Reading the content back from the response. This could contain an error message but for
            //simplicity, this example does trap for that.
            string _returnBody = await _client.GetStringAsync(nsURI);

            Console.WriteLine("Return value from Netscaler CPX list Hostname API");
            Console.WriteLine(_returnBody);
        }
        async static Task SetHostname(string NewHostname)
        {
            //create the URI for Netscaler login
            string nsURI = string.Format(@"http://{0}:{1}/nitro/v1/config/nshostname",NSAddress,NSPort);
            
            Console.WriteLine("Connecting to " + nsURI);
            
            //Create new http client for requests
            HttpClient _client = new HttpClient();
            _client.DefaultRequestHeaders.Add("X-NITRO-USER",NSUsername);
            _client.DefaultRequestHeaders.Add("X-NITRO-PASS",NSPassword);

            Newtonsoft.Json.Linq.JObject _hostname = Newtonsoft.Json.Linq.JObject.FromObject(new
            {
                nshostname = new { hostname = NewHostname }
            });

            //creating the body content that needs to be sent with the HTTP POST.
            HttpContent _hostnameBody = new StringContent(_hostname.ToString(), Encoding.ASCII, @"application/json");
            //setting the content type to application/json for the request. Important!
            _hostnameBody.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            
            //Posting the credentials to the endpoint
            System.Net.Http.HttpResponseMessage _msg = await _client.PutAsync(nsURI, _hostnameBody);
            //Reading the content back from the response. This could contain an error message but for
            //simplicity, this example does trap for that.
            string _responseJson = await _msg.Content.ReadAsStringAsync();

            Console.WriteLine("Return value from Netscaler CPX Set Hostname API");
            Console.WriteLine(_responseJson);
        }
    }
}