using ServiceStack;
using ServiceStack.Messaging;
using ServiceStack.RabbitMq;
using MyApp.ServiceModel;
using MyApp;


ServiceStackHost AppHost;

Host
.CreateDefaultBuilder(args)
.ConfigureServices((hostContext, services) =>
{
    AppHost = new GenericAppHost(typeof(MyService).Assembly)
    {
        ConfigureAppHost = host =>
        {
            var mqServer = new RabbitMqServer(hostContext.Configuration.GetConnectionString("RabbitMq"))
            {
                DisablePublishingToOutq = true,
            };
            mqServer.RegisterHandler<Hello>(host.ExecuteMessage);
            host.Register<IMessageService>(mqServer);
        }
    }.Init();

    services.AddSingleton(AppHost.Resolve<IMessageService>());
    services.AddHostedService<MqWorker>();
})
.Build()
.Run();
