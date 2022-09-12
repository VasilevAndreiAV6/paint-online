using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using paint.online.server.DataStorage;
using paint.online.server.HubConfig;
using paint.online.server.Models;

namespace paint.online.server.Controllers
{
    [Route("api/elements")]
    [ApiController]
    public class ElementsController : ControllerBase
    {
        private readonly IHubContext<ElementsHub> _hub;

        public ElementsController(IHubContext<ElementsHub> hub)
        {
            _hub = hub;
        }

        [HttpGet]
        public List<ElementModel> Get()
        {
            return DataManager.elements;
        }
    }
}
