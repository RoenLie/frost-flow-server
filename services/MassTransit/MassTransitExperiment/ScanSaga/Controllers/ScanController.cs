using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TransitModels;

namespace ScanSaga.Controllers;

[ApiController]
[Route("[controller]")]
public class ScanController : ControllerBase
{
    private readonly ILogger<ScanController> logger;
    private readonly IBus bus;

    public ScanController(ILogger<ScanController> logger, IBus bus)
    {
        this.logger = logger;
        this.bus = bus;
    }

    [HttpPost]
    public async void Post()
    {
        await bus.Publish(new Scan()
        {
            Name = "first test for publishing something"
        });
    }
}
