using RabbitMQ.Client;
using WorkerService1;
using WorkerService1.RabbitWrapper;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddSingleton<IConnectionProvider>(new ConnectionProvider("localhost")); //"amqp://guest:guest/localhost:15672"
        services.AddSingleton<ISubscriber>(_ =>
        {
            var provider = _.GetService<IConnectionProvider>();
            if (provider is null)
                throw new Exception("Could not resolve a connection provider");

            return new Subscriber(
                connectionProvider: provider,
                exchange: "service_exchange",
                routingKey: "*",
                exchangeType: ExchangeType.Topic);
        });

        services.AddHostedService<Worker>();
    })
    .Build();

host.Run();
