using MassTransit;
using TransitModels;

internal class ScanConsumer : IConsumer<Scan>
{
    public async Task Consume(ConsumeContext<Scan> context)
    {
        await Console.Out.WriteLineAsync(context.Message.Name);
    }
}