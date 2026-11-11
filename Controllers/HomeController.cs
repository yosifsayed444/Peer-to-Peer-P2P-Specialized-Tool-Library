using Microsoft.AspNetCore.Mvc;
using Peer_to_Peer__P2P__Specialized_Tool_Library.Models;
using System.Diagnostics;

namespace Peer_to_Peer__P2P__Specialized_Tool_Library.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
