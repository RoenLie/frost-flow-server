
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using WorkerService1.RabbitWrapper;

namespace WorkerService1;
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger, ISubscriber subscriber)
    {
        _logger = logger;

        subscriber.Subscribe((message, headers) =>
        {
            string logInfo = $"received message: {message}";
            logger.LogInformation(message: logInfo);
            
            return true;
        });
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            try
            {
                await Task.Delay(1000, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }
        }
    }
}
