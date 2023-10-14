using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.FileProviders;

namespace homeAutomationNet.Core.Webserver
{
    public class Webserver
    {
        IWebHost host;

        public void Start()
        {
            host = new WebHostBuilder()
              .UseContentRoot(Directory.GetCurrentDirectory())
              //.ConfigureLogging(logging =>
              //{
              //    logging.ClearProviders();
              //    if (Logger != null)
              //        logging.AddProvider(new LoggerProvider(Logger));
              //})
              .UseKestrel()
              //.ConfigureServices(services =>
              //{
              //    services.AddSingleton<IAuthenticationService>(new AuthenticationService(UserCredentialsFinder));
              //})
              .ConfigureKestrel(options =>
              {
                  options.ListenAnyIP(8088, listenOptions =>
                  {
                      listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
                  });

                  //IPGlobalProperties ipProperties = IPGlobalProperties.GetIPGlobalProperties();
                  //var ipEndPoints = ipProperties.GetActiveTcpListeners();

                  //foreach (var p in PortList)
                  //{
                  //    var usedEp = ipEndPoints.FirstOrDefault(x => x.Port == p.port);
                  //    if (usedEp != null && Logger != null)
                  //    {
                  //        Logger(LogLevel.Error, "Could not Bind Port: " + p.port + ", is already in use.", null);
                  //    }
                  //    else
                  //    {
                  //        options.ListenAnyIP(p.port, listenOptions =>
                  //        {
                  //            listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;

                  //            if (p.certificate != null)
                  //            {
                  //                listenOptions.UseHttps(p.certificate, httpsConnectionAdapterOptions =>
                  //                {
                  //                    if (p.clientCertificateMode.HasValue)
                  //                    {
                  //                        httpsConnectionAdapterOptions.OnAuthenticate = (connectionContext, sslServerAuthenticationOptions) =>
                  //                        {
                  //                            var test = new System.Net.Security.SslServerAuthenticationOptions();
                  //                            sslServerAuthenticationOptions = test;
                  //                            var bla2 = connectionContext;
                  //                        };
                  //                        httpsConnectionAdapterOptions.ClientCertificateMode = p.clientCertificateMode.Value;
                  //                        httpsConnectionAdapterOptions.ClientCertificateValidation = (certificate, chain, sslPolicyErrors) =>
                  //                        {
                  //                            if (sslPolicyErrors == System.Net.Security.SslPolicyErrors.None)
                  //                                return true;

                  //                            return false;
                  //                        };
                  //                    }
                  //                });
                  //            }
                  //        });
                  //    }
                  //}
              })
              .Configure(app =>
              {
                  app.UseDefaultFiles();
                  app.UseStaticFiles(new StaticFileOptions()
                  {
                      FileProvider = new PhysicalFileProvider("D:\\repos\\github\\homeAutomationNet\\homeAutomationNet.Core\\homeAutomationNet\\html"),
                  });
              })
              .Build();
           
            //host.RunAsync(cts.Token);
            host.Run();
        }
    }
}
