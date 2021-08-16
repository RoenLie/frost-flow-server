using System.Text;
using RabbitMQ.Client;

var factory = new ConnectionFactory() { HostName = "localhost" };
System.Console.WriteLine(" Press [ctrl + c] to exit.");

while (true)
{
   var message = Console.ReadLine();
   if (string.IsNullOrWhiteSpace(message))
      continue;

   using var connection = factory.CreateConnection();
   using (var channel = connection.CreateModel())
   {
      channel.ExchangeDeclare(exchange: "logs", type: ExchangeType.Fanout);

      var body = Encoding.UTF8.GetBytes(message);
      channel.BasicPublish(exchange: "logs",
                           routingKey: string.Empty,
                           basicProperties: null,
                           body: body);

      System.Console.WriteLine($" [x] Sent: {message}");
   }
}
