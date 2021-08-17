using RabbitMQ.Client;

namespace WorkerService1.RabbitWrapper
{
    public interface IConnectionProvider : IDisposable
    {
        IConnection GetConnection();
    }
}
