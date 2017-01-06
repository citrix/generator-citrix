using System;
using System.Threading.Tasks;

namespace <%= appName %>
{
    public partial class Program
    {
        //member variables to store the information the user
        //had entered (from the yoeman generator)

        public static string NSUsername { get; set;}
        public static string NSPassword { get; set;}
        public static string NSAddress { get; set;}
        public static string NSPort {get; set; }

        public static void Main(string[] args)
        {
            //Execute the async entry point. This allows us to 
            //use async/await from a console app.
            Task mainRunTask = AppEntryAsync();
            mainRunTask.Wait();
        }
        async static Task AppEntryAsync()
        {
            NSUsername = "<%= nsUsername %>";
            NSPassword = "<%= nsPassword %>";
            NSAddress = "<%= nsAddress %>";
            NSPort = "<%= nsPort %>";

            //call the authentication method to auth to NS CPX
            await Authenticate();
            Console.WriteLine();
            
        }
        
        

        
    }
}
