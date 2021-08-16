using System.Text;
using RabbitMQ.Client;

var factory = new ConnectionFactory() { HostName = "localhost" };
Console.WriteLine(" Press [ctrl + c] to exit.");

while (true)
{
   var message = Console.ReadLine();
   if (string.IsNullOrWhiteSpace(message))
      continue;

   using var connection = factory.CreateConnection();
   using (var channel = connection.CreateModel())
   {
      channel.QueueDeclare(queue: "task_queue",
                           durable: true,
                           exclusive: false,
                           autoDelete: false,
                           arguments: null);

      // var message = GetMessageFromArgs(args);
      var body = Encoding.UTF8.GetBytes(message);

      var properties = channel.CreateBasicProperties();
      properties.Persistent = true;

      channel.BasicPublish(exchange: "",
                           routingKey: "task_queue",
                           basicProperties: properties,
                           body: body);
      Console.WriteLine($" [x] Send {message}");
   }
}


// static string GetMessageFromArgs(string[] args)
// {
//    return ((args.Length > 0) ? string.Join(" ", args) : "Hello Worldie!");
// }