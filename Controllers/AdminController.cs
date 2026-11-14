using Microsoft.AspNetCore.Mvc;

namespace Peer_to_Peer__P2P__Specialized_Tool_Library.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult admindashboard()
        {
            return View();
        }

        public IActionResult adminsettings()
        {
            return View();
        }

        public IActionResult auditlog()
        {
            return View();
        }

        public IActionResult rolemanagement()
        {
            return View();
        }

    }
}