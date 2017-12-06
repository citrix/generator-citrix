using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;

namespace <%= appName %>
{
    public partial class Program
    {
        async static Task Authenticate()
        {
            //create the URI for Netscaler login
            string nsURI = string.Format(@"http://{0}:{1}/nitro/v1/config/login",NSAddress,NSPort);
            
            Console.WriteLine("Connecting to " + nsURI);
            
            //Create new http client for requests
            HttpClient _client = new HttpClient();

            //creating the JSON login object.
            //format should be {"login": {"username":"uname","password":"pass"}}
            Newtonsoft.Json.Linq.JObject _login = Newtonsoft.Json.Linq.JObject.FromObject(new
            {
                login = new { username = NSUsername, password = NSPassword }
            });

            //creating the body content that needs to be sent with the HTTP POST.
            HttpContent _loginBody = new StringContent(_login.ToString(), Encoding.ASCII, @"application/json");
            //setting the content type to application/json for the request. Important!
            _loginBody.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            
            //Posting the credentials to the endpoint
            System.Net.Http.HttpResponseMessage _msg = await _client.PostAsync(nsURI, _loginBody);
            //Reading the content back from the response. This could contain an error message but for
            //simplicity, this example does trap for that.
            string _responseJson = await _msg.Content.ReadAsStringAsync();

            //convert the response json into a plain old CLR object (class)
            ReturnInfo returnJsonBody = Newtonsoft.Json.JsonConvert.DeserializeObject<ReturnInfo>(_responseJson);
            //Print out information returned to the user
            Console.WriteLine("Return value from Netscaler CPX authentication");
            Console.WriteLine(_responseJson);
            
        }
    }
}