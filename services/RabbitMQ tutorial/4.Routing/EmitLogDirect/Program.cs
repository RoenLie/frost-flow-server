using System.Text;
using RabbitMQ.Client;


System.Console.WriteLine(" Press [ctrl + c] to exit.");

var factory = new ConnectionFactory() { HostName = "localhost" };

while (true)
{
   var message = Console.ReadLine();
   if (string.IsNullOrWhiteSpace(message))
      continue;

   using var connection = factory.CreateConnection();
   using (var channel = connection.CreateModel())
   {
      channel.ExchangeDeclare(exchange: "direct_logs",
                              type: ExchangeType.Direct);

      var parsedMessage = message.Split(":").AsEnumerable();

      var severity = parsedMessage.ToArray()[0];
      var text = string.Join(" ", parsedMessage.Skip(1).ToArray()).Trim();

      if (string.IsNullOrWhiteSpace(severity))
         severity = "info";

      var body = Encoding.UTF8.GetBytes(text);
      channel.BasicPublish(exchange: "direct_logs",
                           routingKey: severity,
                           basicProperties: null,
                           body: body);

      System.Console.WriteLine($" [x] Sent '{severity}':'{text}'");
   }
}
