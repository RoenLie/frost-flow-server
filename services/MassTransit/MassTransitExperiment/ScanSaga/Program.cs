using MassTransit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Setup mass transit rabbitmq implementation.
builder.Services.AddMassTransit(config =>
{
    config.AddConsumer<ScanConsumer>();

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("rabbitmq");
            h.Password("rabbitmq");
        });
        cfg.ReceiveEndpoint("scan-queue", c =>
        {
            c.ConfigureConsumer<ScanConsumer>(ctx);
        });
    });
});
builder.Services.AddMassTransitHostedService();

// Set swagger version.
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ScanSaga", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (builder.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ScanSaga v1"));
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
