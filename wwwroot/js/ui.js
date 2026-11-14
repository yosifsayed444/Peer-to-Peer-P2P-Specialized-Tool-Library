/* public/js/ui.js — shared frontend interactions for the static prototype.
   Loaded on every page; all handlers are selector-driven and safe no-ops
   when the matching markup is absent.
*/
(function () {
    'use strict';

    /* ---------- Toast helper ---------- */
    function ensureToastContainer() {
        let c = document.getElementById('ts-toast-container');
        if (!c) {
            c = document.createElement('div');
            c.id = 'ts-toast-container';
            c.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(c);
        }
        return c;
    }

    window.ToolShareToast = function (message, type) {
        type = type || 'info';
        const wrap = document.createElement('div');
        const variants = { success: 'text-bg-success', danger: 'text-bg-danger', warning: 'text-bg-warning', info: 'text-bg-primary' };
        wrap.innerHTML =
            '<div class="toast align-items-center border-0 ' + (variants[type] || variants.info) + '" role="alert">' +
            '<div class="d-flex"><div class="toast-body">' + message + '</div>' +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>';
        ensureToastContainer().appendChild(wrap);
        const el = wrap.querySelector('.toast');
        if (window.bootstrap && bootstrap.Toast) {
            const t = new bootstrap.Toast(el, { delay: 3200 });
            t.show();
            el.addEventListener('hidden.bs.toast', () => wrap.remove());
        } else {
            el.style.display = 'block';
            setTimeout(() => wrap.remove(), 3200);
        }
    };

    /* ---------- 1) Bootstrap form validation ---------- */
    document.querySelectorAll('form').forEach(function (form) {
        if (form.classList.contains('no-validate') || form.dataset.tsNoValidate) return;
        form.classList.add('needs-validation');
        form.addEventListener('submit', function (e) {
            form.classList.add('was-validated');
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                ToolShareToast('Please fix the highlighted fields.', 'warning');
                return;
            }
            // Prototype: no backend — acknowledge instead of navigating.
            e.preventDefault();
            ToolShareToast('Form submitted (demo — backend not connected).', 'success');
        });
    });

    /* ---------- 2) File input preview ---------- */
    document.querySelectorAll('input[type="file"]').forEach(function (inp) {
        const preview = document.createElement('div');
        preview.className = 'ts-file-preview small text-muted mt-1';
        inp.insertAdjacentElement('afterend', preview);
        inp.addEventListener('change', function () {
            preview.innerHTML = '';
            Array.prototype.forEach.call(inp.files, function (file) {
                const line = document.createElement('div');
                line.innerHTML = '<i class="fas fa-paperclip"></i> ';
                line.appendChild(document.createTextNode(file.name + ' (' + (file.size / 1024).toFixed(0) + ' KB)'));
                preview.appendChild(line);
            });
        });
    });

    /* ---------- 3) Copy buttons ---------- */
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button, a');
        if (!btn) return;
        const label = (btn.textContent || '').trim().toLowerCase();
        const isCopy = btn.id === 'copyRef' || /^copy\b/.test(label) || label === 'نسخ';
        if (!isCopy) return;
        // find the nearest input/select to copy
        const scope = btn.closest('.input-group') || btn.closest('.card-body') || btn.parentElement;
        const field = scope ? scope.querySelector('input[readonly], input[type="text"], textarea') : null;
        const text = field ? field.value : '';
        if (!text) { ToolShareToast('Nothing to copy.', 'warning'); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                ToolShareToast('Copied to clipboard.', 'success');
            });
        } else {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); ToolShareToast('Copied to clipboard.', 'success'); }
            catch (err) { ToolShareToast('Copy failed.', 'danger'); }
            document.body.removeChild(ta);
        }
    });

    /* ---------- 4) Filtering ----------
       Scope resolution:
         - controls inside a .card that contains .table-responsive  -> that table
         - .card[data-filter-for="ID"]                              -> element #ID
       Items: .table tbody tr  OR  [data-filter-item] inside target.
    */
    function getScope(card) {
        const table = card.querySelector('.table-responsive');
        if (table) return { kind: 'table', el: table };
        const forId = card.dataset.filterFor;
        if (forId) {
            const target = document.getElementById(forId);
            if (target) return { kind: 'cards', el: target };
        }
        return null;
    }

    function getItems(scope) {
        if (scope.kind === 'table') {
            return Array.prototype.slice.call(scope.el.querySelectorAll('tbody tr'));
        }
        const items = scope.el.querySelectorAll('[data-filter-item]');
        return items.length ? Array.prototype.slice.call(items) : [];
    }

    function labelFor(control) {
        const col = control.closest('.col');
        if (col) {
            const lab = col.querySelector('.form-label');
            if (lab) return lab.textContent.trim().toLowerCase();
        }
        const prev = control.previousElementSibling;
        if (prev && prev.classList.contains('form-label')) return prev.textContent.trim().toLowerCase();
        return '';
    }

    function isSortLabel(label) { return /sort|order/i.test(label); }
    function isAllOption(sel) {
        const first = sel.options && sel.options[0];
        return !first || first.value === '' || /^all\b/i.test(first.textContent.trim());
    }

    function buildPredicate(control) {
        const tag = control.tagName.toLowerCase();
        const type = (control.type || '').toLowerCase();
        const label = labelFor(control);

        if (tag === 'select') {
            if (!isAllOption(control) || isSortLabel(label)) return null; // sort controls handled separately
            return function (item) {
                const v = control.value.trim().toLowerCase();
                if (!v) return true;
                const dsKey = label.replace(/[^a-z]/g, '');
                if (item.dataset && item.dataset[dsKey] !== undefined) {
                    return item.dataset[dsKey].toLowerCase() === v || item.dataset[dsKey].toLowerCase().indexOf(v) !== -1;
                }
                return (item.textContent || '').toLowerCase().indexOf(v) !== -1;
            };
        }

        if (type === 'text' || type === 'search') {
            return function (item) {
                const v = control.value.trim().toLowerCase();
                return !v || (item.textContent || '').toLowerCase().indexOf(v) !== -1;
            };
        }

        if (type === 'number') {
            if (!control.value) return function () { return true; };
            const num = parseFloat(control.value);
            if (isNaN(num)) return null;
            if (/min/.test(label)) {
                return function (item) {
                    const p = parseFloat(item.dataset && item.dataset.price);
                    return isNaN(p) ? true : p >= num;
                };
            }
            if (/max/.test(label)) {
                return function (item) {
                    const p = parseFloat(item.dataset && item.dataset.price);
                    return isNaN(p) ? true : p <= num;
                };
            }
            if (/radius|distance/.test(label)) {
                return function (item) {
                    const d = parseFloat(item.dataset && item.dataset.distance);
                    return isNaN(d) ? true : d <= num;
                };
            }
            return null;
        }

        if (type === 'date') return null; // availability dates need backend logic
        return null;
    }

    function applyFilters(scope, controls) {
        const items = getItems(scope);
        const preds = controls.map(buildPredicate).filter(Boolean);
        let visible = 0;
        items.forEach(function (item) {
            const show = preds.every(function (p) { return p(item); });
            item.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        // empty state row for tables
        if (scope.kind === 'table') {
            let empty = scope.el.querySelector('.ts-empty-row');
            if (visible === 0 && items.length) {
                if (!empty) {
                    const cols = scope.el.querySelector('thead tr') ? scope.el.querySelector('thead tr').children.length : 1;
                    empty = document.createElement('tr');
                    empty.className = 'ts-empty-row';
                    empty.innerHTML = '<td colspan="' + cols + '" class="text-center text-muted py-4"><i class="fas fa-search me-2"></i>No results match your filters.</td>';
                    scope.el.querySelector('tbody').appendChild(empty);
                }
                empty.style.display = '';
            } else if (empty) {
                empty.style.display = 'none';
            }
        } else if (visible === 0 && items.length) {
            let empty = scope.el.querySelector('.ts-empty-state');
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'ts-empty-state col-12 text-center text-muted py-5';
                empty.innerHTML = '<i class="fas fa-search fa-2x mb-2 d-block"></i>No tools match your filters.';
                scope.el.appendChild(empty);
            }
            empty.style.display = '';
        } else {
            const empty = scope.el.querySelector('.ts-empty-state');
            if (empty) empty.style.display = 'none';
        }
        // update result counter badge if present
        const card = controls[0] && controls[0].closest('[data-filter-for]');
        const badge = card && card.querySelector('[data-result-count]');
        if (badge) badge.textContent = visible + ' result' + (visible === 1 ? '' : 's') + ' found';
        return visible;
    }

    function wireScope(scope, card) {
        const controls = Array.prototype.slice.call(
            card.querySelectorAll('input[type="text"], input[type="search"], input[type="number"], select.form-select')
        );
        if (!controls.length) return;

        let timer;
        controls.forEach(function (c) {
            const evt = (c.tagName === 'SELECT' || c.type === 'number') ? 'change' : 'input';
            c.addEventListener(evt, function () {
                clearTimeout(timer);
                timer = setTimeout(function () { applyFilters(scope, controls); }, c.tagName === 'SELECT' ? 0 : 180);
            });
        });

        // reset button inside same card
        const resetBtn = Array.prototype.slice.call(card.querySelectorAll('button')).find(function (b) {
            return /reset|clear|إعادة/i.test(b.textContent);
        });
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                controls.forEach(function (c) { c.value = c.tagName === 'SELECT' ? (c.options[0] ? c.options[0].value : '') : ''; });
                applyFilters(scope, controls);
            });
        }

        // Apply button -> acknowledge
        const applyBtn = Array.prototype.slice.call(card.querySelectorAll('button')).find(function (b) {
            return /apply|filter/i.test(b.textContent) && !/reset|clear/i.test(b.textContent);
        });
        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                applyFilters(scope, controls);
                ToolShareToast('Filters applied.', 'success');
            });
        }

        applyFilters(scope, controls);
    }

    document.querySelectorAll('.card').forEach(function (card) {
        const scope = getScope(card);
        if (scope) wireScope(scope, card);
    });

    /* ---------- 5) Sorting (tools grid) ---------- */
    const sortSelect = document.getElementById('sortTools');
    const grid = document.getElementById('toolsGrid');
    if (sortSelect && grid) {
        const items = Array.prototype.slice.call(grid.querySelectorAll('[data-filter-item]'));
        const keyFor = function (opt) {
            const t = opt.textContent.toLowerCase();
            if (/price.*low|low.*high/.test(t.replace(/:/g, ' ')) || /price: low/.test(t)) return 'price-asc';
            if (/price.*high|high.*low/.test(t.replace(/:/g, ' ')) || /price: high/.test(t)) return 'price-desc';
            if (/nearest|distance/.test(t)) return 'distance-asc';
            if (/rated|rating|top/.test(t)) return 'rating-desc';
            return 'default';
        };
        const num = function (item, k) { const v = parseFloat(item.dataset[k]); return isNaN(v) ? 0 : v; };
        sortSelect.addEventListener('change', function () {
            const key = keyFor(sortSelect.options[sortSelect.selectedIndex]);
            const sorted = items.slice().sort(function (a, b) {
                if (key === 'price-asc') return num(a, 'price') - num(b, 'price');
                if (key === 'price-desc') return num(b, 'price') - num(a, 'price');
                if (key === 'distance-asc') return num(a, 'distance') - num(b, 'distance');
                if (key === 'rating-desc') return num(b, 'rating') - num(a, 'rating');
                return 0;
            });
            sorted.forEach(function (it) { grid.appendChild(it); });
        });
    }

    /* ---------- 6) Chat (messages page) ---------- */
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-input input');
    const chatBtn = document.querySelector('.chat-input .btn');
    if (chatBody && chatInput && chatBtn) {
        const send = function () {
            const text = chatInput.value.trim();
            if (!text) return;
            const msg = document.createElement('div');
            msg.className = 'msg me';
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            msg.innerHTML = '';
            msg.appendChild(document.createTextNode(text));
            const meta = document.createElement('span');
            meta.className = 'meta';
            meta.textContent = 'You — ' + time;
            msg.appendChild(meta);
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
            chatInput.value = '';
        };
        chatBtn.addEventListener('click', send);
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); send(); }
        });
    }

    /* ---------- 7) Notifications: mark read ---------- */
    document.querySelectorAll('button, a').forEach(function (btn) {
        if (!/mark all read/i.test(btn.textContent || '')) return;
        btn.addEventListener('click', function () {
            document.querySelectorAll('.list-group-item .badge').forEach(function (b) {
                if (/unread/i.test(b.textContent)) b.remove();
            });
            ToolShareToast('All notifications marked as read.', 'success');
        });
    });
    document.querySelectorAll('.list-group-item').forEach(function (item) {
        const badge = Array.prototype.slice.call(item.querySelectorAll('.badge')).find(function (b) {
            return /unread/i.test(b.textContent);
        });
        if (!badge) return;
        item.style.cursor = 'pointer';
        item.title = 'Click to mark as read';
        item.addEventListener('click', function (e) {
            if (e.target.closest('a,button')) return;
            badge.remove();
            item.classList.add('opacity-75');
        });
    });

    /* ---------- 8) Demo toast for unconnected actions ---------- */
    document.addEventListener('click', function (e) {
        const el = e.target.closest('button.btn, a.btn');
        if (!el) return;
        if (el.closest('form, nav, .chat-input, .pagination')) return;
        if (el.dataset.bsToggle || el.dataset.bsDismiss) return;
        if (el.type === 'submit') return;
        const destructive = /delete|retire|ban|reject|remove|suspend/i.test(el.textContent);
        if (destructive && !window.confirm('This is a demo. Proceed with "' + el.textContent.trim().slice(0, 40) + '"?')) {
            e.preventDefault(); e.stopPropagation();
            return;
        }
        if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') return;
        ToolShareToast(destructive ? 'Action simulated (demo).' : 'Demo — this action is not connected to a backend yet.', destructive ? 'warning' : 'info');
    });

    /* ---------- 9) Misc polish ---------- */
    // date inputs default to today
    document.querySelectorAll('input[type="date"]:not([min])').forEach(function (d) {
        const t = new Date().toISOString().split('T')[0];
        d.min = t;
    });
    // prevent '#' links from jumping to top (dropdown toggles still work via Bootstrap)
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href="#"]');
        if (a && !a.dataset.bsToggle && !a.closest('.pagination')) {
            e.preventDefault();
        }
    });
})();
