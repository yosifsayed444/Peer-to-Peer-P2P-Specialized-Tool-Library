# P2P Specialized Tool Library - MVC Frontend Integration

## What was done
- Integrated all 62 HTML frontend pages as ASP.NET Core Razor Views.
- Added simple MVC controllers/actions that return their corresponding View.
- Organized frontend static files under `wwwroot` while preserving the original `css`, `js`, and `assets` folders.
- Updated local HTML page links and dashboard/sidebar JavaScript navigation to MVC routes.
- Kept each page's original full HTML document so its own page structure, styles, and scripts remain intact.
- Added `UseStaticFiles()` to serve frontend assets.

## Controllers and routes
- `/Home/{action}`: public pages (including `/Home/Index`).
- `/Admin/{action}`: admin pages.
- `/Library/{action}`: library administration pages.
- `/Maintenance/{action}`: maintenance pages.
- `/Member/{action}`: member pages.

The default route remains `/` -> `Home/Index`.

## Run
Open `Peer-to-Peer (P2P) Specialized Tool Library.csproj` in Visual Studio and run the project.
The project targets .NET 10.

## Scope
This is a frontend integration pass only. Actions currently return Views and do not implement business logic, database operations, or model binding. The original backend project files and documentation are retained. Build verification could not be run in this environment because the .NET SDK is not installed.
