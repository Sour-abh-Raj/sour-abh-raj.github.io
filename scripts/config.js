/* config.js — Backend URL management for Digital Twin pages */

const DEFAULT_BACKEND = 'http://localhost:8080';
const STORAGE_KEY     = 'twin_backend_url';

function getBackend() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_BACKEND;
}
function setBackend(url) {
  localStorage.setItem(STORAGE_KEY, url.replace(/\/$/, ''));
}

/* Health check — resolves true/false */
async function checkBackend() {
  try {
    const res = await fetch(getBackend() + '/api/status', {
      signal: AbortSignal.timeout(4000)
    });
    return res.ok;
  } catch { return false; }
}

/* Show/hide offline banner */
async function updateStatusBanner() {
  const ok = await checkBackend();
  const pill = document.getElementById('backend-pill');
  const banner = document.getElementById('offline-banner');
  if (pill) {
    pill.className = ok ? 'status-pill' : 'status-pill offline';
    pill.innerHTML = ok
      ? '<div class="status-dot"></div> Twin Online'
      : '<div class="status-dot"></div> Offline';
  }
  if (banner) banner.className = ok ? '' : 'show';
  return ok;
}

/* Config modal helpers */
function openConfigModal() {
  const m = document.getElementById('config-modal');
  if (m) {
    document.getElementById('backend-url-input').value = getBackend();
    m.className = 'modal-overlay show';
  }
}
function closeConfigModal() {
  const m = document.getElementById('config-modal');
  if (m) m.className = 'modal-overlay';
}
function saveConfig() {
  const v = document.getElementById('backend-url-input').value.trim();
  if (v) { setBackend(v); updateStatusBanner(); }
  closeConfigModal();
}
