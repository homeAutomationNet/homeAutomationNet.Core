using homeAutomationNet.Core.Webserver;

public static class Program
{
    public static void Main(string[] args)
    {
        // See https://aka.ms/new-console-template for more information
        Console.WriteLine("Hello, World!");

        var webserver = new Webserver();
        webserver.Start();
        Console.ReadLine();
    }
}



//todo startup:
// - start webserver
// - migration will be started from UI, not directly any more, so you can also do rollback via ui
// - only if database is migrated, db query service will be started
// - ui shows "database needs migration"
// - translation service wich uses a online service