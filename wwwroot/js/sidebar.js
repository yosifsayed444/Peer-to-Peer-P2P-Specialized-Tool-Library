/* public/js/sidebar.js — shared dashboard sidebar builder.
   Usage: after including functions-data.js, call
   renderSidebar('admin'|'support', '<activeHref>').
   Unit groups are collapsible; the group containing the active item stays open.
   Pages live in role folders (admin/, library/, maintenance/), so every
   href is resolved relative to the current page location.
*/

const SIDEBAR_ROUTES = {
  "about.html": "/Home/about",
  "admin-dashboard.html": "/Admin/admindashboard",
  "admin-settings.html": "/Admin/adminsettings",
  "audit-log.html": "/Admin/auditlog",
  "role-management.html": "/Admin/rolemanagement",
  "contact.html": "/Home/contact",
  "faq.html": "/Home/faq",
  "function.html": "/Home/Function",
  "how-it-works.html": "/Home/howitworks",
  "index.html": "/Home/Index",
  "add-user.html": "/Library/adduser",
  "audit-detail.html": "/Library/auditdetail",
  "blacklist.html": "/Library/blacklist",
  "bookings.html": "/Library/Bookings",
  "broadcasts.html": "/Library/broadcasts",
  "claim-detail.html": "/Library/claimdetail",
  "dispute-detail.html": "/Library/disputedetail",
  "disputes.html": "/Library/disputes",
  "handover-detail.html": "/Library/handoverdetail",
  "handover-management.html": "/Library/handovermanagement",
  "insurance-claims.html": "/Library/insuranceclaims",
  "inventory-audits.html": "/Library/inventoryaudits",
  "late-returns.html": "/Library/latereturns",
  "librarian-tasks.html": "/Library/librariantasks",
  "promotions.html": "/Library/promotions",
  "reports.html": "/Library/reports",
  "support-dashboard.html": "/Library/supportdashboard",
  "tools-admin.html": "/Library/toolsadmin",
  "users.html": "/Library/users",
  "zones.html": "/Library/zones",
  "login.html": "/Home/login",
  "disposal.html": "/Maintenance/disposal",
  "external-repair.html": "/Maintenance/externalrepair",
  "maintenance-dashboard.html": "/Maintenance/maintenancedashboard",
  "maintenance-history.html": "/Maintenance/maintenancehistory",
  "technician-metrics.html": "/Maintenance/technicianmetrics",
  "technician-profile.html": "/Maintenance/technicianprofile",
  "tool-health.html": "/Maintenance/toolhealth",
  "add-tool.html": "/Member/Addtool",
  "booking-calendar.html": "/Member/bookingcalendar",
  "booking-detail.html": "/Library/Bookingdetail",
  "checkout.html": "/Member/checkout",
  "damage-report.html": "/Member/damagereport",
  "edit-tool.html": "/Member/edittool",
  "handover.html": "/Member/handover",
  "member-dashboard.html": "/Member/memberdashboard",
  "my-bookings.html": "/Member/mybookings",
  "my-tools.html": "/Member/mytools",
  "notifications.html": "/Member/notifications",
  "payment-history.html": "/Member/paymenthistory",
  "ratings.html": "/Member/ratings",
  "referral.html": "/Member/referral",
  "wallet.html": "/Member/wallet",
  "messages.html": "/Home/messages",
  "privacy.html": "/Home/privacy",
  "profile.html": "/Home/profile",
  "register.html": "/Home/register",
  "support.html": "/Home/support",
  "terms.html": "/Home/terms",
  "tool-detail.html": "/Home/tooldetail",
  "tools.html": "/Home/tools",
  "user-profile-public.html": "/Home/userprofilepublic"
};

function sidebarRel(href) {
  if (!href) return href;
  if (href.startsWith('/')) return href;
  const match = href.match(/^([A-Za-z0-9_-]+\.html)([?#].*)?$/);
  if (!match) return href;
  return (SIDEBAR_ROUTES[match[1]] || '/') + (match[2] || '');
}

function renderSidebar(role, activeHref) {
  const normalizedActive = sidebarRel(activeHref);
  const items = [];
  const item = (href, icon, label, badge) => {
    const h = sidebarRel(href);
    items.push(
      `<a href="${h}" class="sidebar-item${(h === normalizedActive) ? ' active' : ''}">` +
      (badge || '') +
      `<i class="fas ${icon}"></i><span class="fn-name">${label}</span></a>`
    );
  };
  const fn = n => sidebarRel('/Home/function') + '?fn=' + n;

  if (role === 'admin') {
    items.push('<div class="sidebar-header">Main Menu</div>');
    item('admin-dashboard.html', 'fa-chart-line', 'Overview');
    item(fn(28), 'fa-tachometer-alt', 'Real-time Activity Dashboard');
    item('bookings.html', 'fa-calendar-alt', 'Bookings');
    item('tools-admin.html', 'fa-tools', 'Tools Management');
    item('users.html', 'fa-users', 'Users');
    item('librarian-tasks.html', 'fa-list-check', 'My Tasks');
    items.push('<div class="sidebar-header">Library Operations</div>');
    item('disputes.html', 'fa-gavel', 'Disputes');
    item('inventory-audits.html', 'fa-clipboard-check', 'Inventory Audits');
    item('handover-management.html', 'fa-qrcode', 'Handovers');
    item('insurance-claims.html', 'fa-file-invoice', 'Insurance Claims');
    item('late-returns.html', 'fa-clock', 'Late Returns');
    item('blacklist.html', 'fa-ban', 'Blacklist');
    item('promotions.html', 'fa-bullhorn', 'Campaigns');
    item('broadcasts.html', 'fa-rss', 'Broadcasts');
    item('reports.html', 'fa-chart-bar', 'Reports');
    item('zones.html', 'fa-map-marked-alt', 'Zones');
    items.push('<div class="sidebar-header">Maintenance</div>');
    item('maintenance-dashboard.html', 'fa-screwdriver-wrench', 'Maintenance Dashboard');
    item('tool-health.html', 'fa-heart-pulse', 'Tool Health');
    item('external-repair.html', 'fa-external-link-alt', 'External Repair');
    item('disposal.html', 'fa-recycle', 'Disposal');
    item('maintenance-history.html', 'fa-history', 'Maintenance History');
    item('technician-metrics.html', 'fa-chart-line', 'Technician Metrics');
  } else {
    items.push('<div class="sidebar-header">Main Menu</div>');
    item('support-dashboard.html', 'fa-chart-line', 'Overview');
    item('bookings.html', 'fa-calendar-alt', 'Bookings');
    item('tools-admin.html', 'fa-tools', 'Tools Management');
    item('users.html', 'fa-users', 'Users');
    item('librarian-tasks.html', 'fa-list-check', 'My Tasks');
    items.push('<div class="sidebar-header">Library Operations</div>');
    item('disputes.html', 'fa-gavel', 'Disputes');
    item('inventory-audits.html', 'fa-clipboard-check', 'Inventory Audits');
    item('handover-management.html', 'fa-qrcode', 'Handovers');
    item('insurance-claims.html', 'fa-file-invoice', 'Insurance Claims');
    item('late-returns.html', 'fa-clock', 'Late Returns');
    item('blacklist.html', 'fa-ban', 'Blacklist');
    item('promotions.html', 'fa-bullhorn', 'Campaigns');
    item('broadcasts.html', 'fa-rss', 'Broadcasts');
    item('reports.html', 'fa-chart-bar', 'Reports');
    item('zones.html', 'fa-map-marked-alt', 'Zones');
  }

  const units = role === 'admin' ? [1, 2, 3] : [2];
  let groupOpen = 0;
  for (const unit of units) {
    items.push(
      '<div class="sidebar-header sidebar-toggle" role="button" tabindex="0">' +
      `<span>${UNIT_NAMES[unit]} <span class="sidebar-count">(${FUNCTIONS.filter(x => x.unit === unit).length})</span></span>` +
      '<i class="fas fa-chevron-down sidebar-chevron"></i></div>'
    );
    for (const f of FUNCTIONS.filter(x => x.unit === unit)) {
      item(
        fn(f.n),
        f.icon,
        f.name,
        `<span class="fn-num">${String(f.n).padStart(2, '0')}</span>`
      );
    }
    groupOpen++;
  }

  if (role === 'support') {
    items.push('<div class="sidebar-header">Support</div>');
    item('/Home/messages', 'fa-envelope', 'Messages');
    item('/Home/profile', 'fa-user', 'My Profile');
  }

  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = items.join('');

  /* group each collapsible block: header + following items until next header */
  const headers = [...nav.querySelectorAll('.sidebar-header')];
  headers.forEach(header => {
    if (!header.classList.contains('sidebar-toggle')) return;
    const group = document.createElement('div');
    group.className = 'sidebar-group';
    nav.insertBefore(group, header);
    let node = header.nextElementSibling;
    group.appendChild(header);
    while (node && !node.classList.contains('sidebar-header')) {
      const next = node.nextElementSibling;
      group.appendChild(node);
      node = next;
    }
    /* keep the group with the active link open, collapse the others */
    const hasActive = !!group.querySelector('.sidebar-item.active');
    if (!hasActive) group.classList.add('collapsed');

    const toggle = () => {
      group.classList.toggle('collapsed');
      group.querySelector('.sidebar-chevron')
        .classList.toggle('flipped', !group.classList.contains('collapsed'));
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    const chev = group.querySelector('.sidebar-chevron');
    if (chev && !group.classList.contains('collapsed')) chev.classList.add('flipped');
  });
}
