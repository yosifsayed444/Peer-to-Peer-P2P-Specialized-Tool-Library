/* public/js/dashboard-ui.js
   Shared interaction layer for the dashboard template (static .NET MVC mock).
   - Row action buttons (view/edit/delete/gavel/QR...) open a contextual modal
   - Delete actions get a confirm dialog
   - Logout asks for confirmation, then goes to /Home/login
   - Unwired form buttons (filters, saves...) show a toast
   - Stat cards deep-link to their related section page
*/
(function () {
 'use strict';

  /* Pages live in role folders; resolve links relative to the current page. */
  const inSub = /\/(admin|library|maintenance|member)\//.test(location.pathname);
  const depth = inSub ? '../' : '';
  const libPrefix = /\/admin\//.test(location.pathname)
    ? '../library/'
    : (/\/library\//.test(location.pathname) ? '' : 'library/');

  /* ---------- helpers ---------- */
  const iconMap = {
    'fa-eye': { title: 'View', kind: 'view' },
    'fa-folder-open': { title: 'Evidence', kind: 'view' },
    'fa-edit': { title: 'Edit', kind: 'edit' },
    'fa-trash': { title: 'Delete', kind: 'delete' },
    'fa-ban': { title: 'Blacklist', kind: 'delete' },
    'fa-gavel': { title: 'Resolve dispute', kind: 'resolve' },
    'fa-qrcode': { title: 'Handover QR', kind: 'qr' },
    'fa-id-card': { title: 'KYC review', kind: 'view' },
    'fa-wrench': { title: 'Maintenance', kind: 'view' },
    'fa-chart-bar': { title: 'Performance report', kind: 'view' },
    'fa-rss': { title: 'Send broadcast', kind: 'resolve' },
    'fa-people-arrows': { title: 'Assign librarian', kind: 'resolve' }
  };

  function iconOf(btn) {
    const i = btn.querySelector('i');
    return i ? (i.className.match(/fa-[a-z][a-z0-9-]+/) || [null])[0] : null;
  }

  function rowContext(btn) {
    const tr = btn.closest('tr');
    if (!tr) return null;
    const cells = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
    return cells.slice(0, 3);
  }

  /* ---------- modal ---------- */
  let modal, modalTitle, modalBody, modalActions;

  function ensureModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML =
      '<div class="dashboard-modal card modal-card" role="dialog" aria-modal="true">' +
      '<div class="card-header modal-header-flex"><span id="dash-modal-title">Details</span>' +
      '<button type="button" class="modal-close" aria-label="Close"><i class="fas fa-times"></i></button></div>' +
      '<div class="card-body" id="dash-modal-body"></div>' +
      '<div class="modal-actions" id="dash-modal-actions"></div>' +
      '</div>';
    document.body.appendChild(modal);
    modalTitle = modal.querySelector('#dash-modal-title');
    modalBody = modal.querySelector('#dash-modal-body');
    modalActions = modal.querySelector('#dash-modal-actions');

    function close() { modal.classList.remove('open'); }
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function openModal(title, bodyHtml, actions) {
    ensureModal();
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalActions.innerHTML = '';
    (actions || []).forEach(a => {
      const b = document.createElement('button');
      b.className = 'btn btn-' + (a.variant || 'primary');
      b.innerHTML = a.label;
      b.addEventListener('click', () => {
        modal.classList.remove('open');
        if (typeof a.onClick === 'function') a.onClick();
      });
      modalActions.appendChild(b);
    });
    const cancel = document.createElement('button');
    cancel.className = 'btn btn-outline';
    cancel.textContent = 'Close';
    cancel.addEventListener('click', () => modal.classList.remove('open'));
    modalActions.appendChild(cancel);
    modal.classList.add('open');
  }

  /* generic detail table from row cells */
  function detailList(cells) {
    if (!cells || cells.length === 0) return '<p>This record is a static mock — it becomes real Razor data in the .NET MVC build.</p>';
    return '<ul class="modal-detail-list">' +
      cells.map((c, i) => `<li><span>Field ${i + 1}</span><strong>${c}</strong></li>`).join('') +
      '</ul><p class="modal-note"><i class="fas fa-info-circle"></i> In the .NET MVC build this modal loads the record from the database (Controller + View per function).</p>';
  }

  const toastHost = () => {
    let t = document.querySelector('.dash-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'dash-toast';
      document.body.appendChild(t);
    }
    return t;
  };
  function toast(msg, variant) {
    const t = toastHost();
    t.textContent = msg;
    t.className = 'dash-toast show' + (variant ? ' ' + variant : '');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* row action buttons */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-icon');
    if (!btn || !iconMap[iconOf(btn)]) return;
    const meta = iconMap[iconOf(btn)];
    const ctx = rowContext(btn);
    const ctxLabel = ctx ? ctx.slice(0, 2).join(' — ') : '';

    if (meta.kind === 'view') {
      openModal(`${meta.title} — ${ctxLabel}`, detailList(ctx));
    } else if (meta.kind === 'edit') {
      openModal(`${meta.title} — ${ctxLabel}`,
        '<form onsubmit="return false;">' +
        '<div class="form-group"><label class="filter-label">Note / Comment</label><input type="text" class="form-control" placeholder="Update note…"></div>' +
        '<p class="modal-note"><i class="fas fa-info-circle"></i> Saving updates the entity via a POST action in the .NET MVC build.</p></form>',
        [{ label: '<i class="fas fa-save"></i> Save', onClick: () => toast('Saved (mock) — real POST in the .NET MVC build') }]);
    } else if (meta.kind === 'delete') {
      openModal(`${meta.title}? — ${ctxLabel}`,
        '<p>This action is simulated. In the real .NET MVC build it calls the API and flips the record status (e.g. blacklist / deletion).</p>',
        [{ label: `<i class="fas fa-check"></i> Confirm ${meta.title.toLowerCase()}`, variant: 'danger', onClick: () => toast(`${meta.title} applied (mock)`) }]);
    } else if (meta.kind === 'resolve') {
      openModal(`${meta.title} — ${ctxLabel}`,
        '<div class="form-group"><label class="filter-label">Decision note</label><textarea class="form-control" rows="3" placeholder="Write the decision…"></textarea></div>',
        [{ label: '<i class="fas fa-gavel"></i> Submit decision', onClick: () => toast('Decision submitted (mock)') }]);
    } else if (meta.kind === 'qr') {
      openModal(`Handover QR — ${ctxLabel}`,
        '<div class="qr-placeholder"><i class="fas fa-qrcode"></i><p>Scan this code at handover to confirm the physical exchange (fn 16).</p></div>');
    }
  });

  /* logout */
  document.querySelectorAll('.nav-menu .btn-outline').forEach(btn => {
    if (!btn.textContent.includes('Logout')) return;
    btn.addEventListener('click', () => {
      openModal('Log out?',
        '<p>You will be returned to the login page. This mock clears the demo session.</p>',
        [{ label: '<i class="fas fa-sign-out-alt"></i> Log out', variant: 'danger', onClick: () => { toast('Logged out (mock)'); setTimeout(() => location.href = depth + '/Home/login', 500); } }]);
    });
  });

  /* unwired form buttons -> friendly toast (delegated) */
  document.addEventListener('click', function (e) {
    const target = e.target.closest('.filter-bar button, .chat-input button, form button[type="submit"], .card-header ~ .card-body .btn-success, .card .btn-outline');
    if (!target) return;
    if (target.closest('.modal-actions')) return;
    const label = target.innerText.trim() || 'Action';
    toast(`"${label}" is a checkpoint action — it will hit its controller action in the .NET MVC build.`);
  });

  /* stat cards deep-linking */
  const statTarget = {
    'total users': '/Library/Users', 'users': '/Library/Users',
    'total tools': '/Library/Toolsadmin', 'currently rented': '/Library/Toolsadmin',
    'total bookings': '/Library/Bookings', 'active rentals': '/Library/Bookings', 'completed': '/Library/Bookings', 'bookings': '/Library/Bookings', 'active': '/Library/Bookings', 'pending approval': '/Library/Bookings',
    'pending reports': '/Library/Disputes', 'pending disputes': '/Library/Disputes', 'open disputes': '/Library/Disputes', 'in review': '/Library/Disputes',
    'late returns': '/Library/Bookings', 're-opened after 7 days': '/Library/Disputes',
    'in escrow (egp)': '/Library/Reports', 'revenue this month (egp)': '/Library/Reports', 'late fines collected (fn 19)': '/Library/Reports', 'refunds issued (fn 27)': '/Library/Reports',
    'available': '/Library/Toolsadmin', 'locked "unfit for use" (fn 33)': '/Library/Toolsadmin', 'warranty expiring (fn 35)': '/Library/Toolsadmin'
  };
  document.querySelectorAll('.stat-card').forEach(card => {
    const label = (card.querySelector('.stat-label') || {}).textContent || '';
    const href = statTarget[label.toLowerCase().trim()];
    if (!href) return;
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'link');
    card.title = 'Open ' + href;
    card.addEventListener('click', () => location.href = libPrefix + href);
  });
})();
