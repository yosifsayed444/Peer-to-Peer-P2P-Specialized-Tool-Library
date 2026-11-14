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

        public IActionResult about()
        {
            return View();
        }

        public IActionResult contact()
        {
            return View();
        }

        public IActionResult faq()
        {
            return View();
        }

        public IActionResult function()
        {
            return View();
        }

        public IActionResult howitworks()
        {
            return View();
        }

        public IActionResult login()
        {
            return View();
        }

        public IActionResult messages()
        {
            return View();
        }

        public IActionResult privacy()
        {
            return View();
        }

        public IActionResult profile()
        {
            return View();
        }

        public IActionResult register()
        {
            return View();
        }

        public IActionResult support()
        {
            return View();
        }

        public IActionResult terms()
        {
            return View();
        }

        public IActionResult tooldetail()
        {
            return View();
        }

        public IActionResult tools()
        {
            return View();
        }

        public IActionResult userprofilepublic()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("~/Views/Shared/Error.cshtml",
                new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}