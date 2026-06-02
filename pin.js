// Klasi PIN-suojaus — vaihda PIN muuttamalla KLASI_PIN arvoa
const KLASI_PIN = "040804";

(function() {
  const STORAGE_KEY = "klasi_auth";
  const SESSION_HOURS = 8;

  function onAuth() {
    const overlay = document.getElementById("pin-overlay");
    if(overlay) overlay.remove();
  }

  function checkSession() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.pin === KLASI_PIN) {
        const hours = (Date.now() - saved.time) / 3600000;
        if (hours < SESSION_HOURS) return true;
      }
    } catch(e) {}
    return false;
  }

  function saveSession() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pin: KLASI_PIN, time: Date.now() }));
  }

  function showPin() {
    const overlay = document.createElement("div");
    overlay.id = "pin-overlay";
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0B2F5C;z-index:99999;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:32px 24px;width:280px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
        <div style="font-size:22px;font-weight:700;color:#0B2F5C;margin-bottom:4px;">Klasi Oy</div>
        <div style="font-size:13px;color:#888;margin-bottom:24px;">Syötä PIN-koodi</div>
        <input id="pin-input" type="password" inputmode="numeric" maxlength="6"
          style="width:100%;text-align:center;font-size:28px;letter-spacing:8px;padding:12px;border:2px solid #e0e0e0;border-radius:10px;outline:none;font-family:monospace;">
        <div id="pin-error" style="color:#c62828;font-size:13px;margin-top:10px;min-height:18px;"></div>
        <button onclick="window._klasiCheckPin()"
          style="width:100%;margin-top:12px;padding:14px;background:#0B2F5C;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;">
          Kirjaudu
        </button>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      const input = document.getElementById("pin-input");
      if(input) {
        input.focus();
        input.addEventListener("keydown", e => { if(e.key === "Enter") window._klasiCheckPin(); });
      }
    }, 100);
  }

  window._klasiCheckPin = function() {
    const input = document.getElementById("pin-input");
    if(!input) return;
    const val = input.value.trim();
    if (val === KLASI_PIN) {
      saveSession();
      onAuth();
    } else {
      document.getElementById("pin-error").textContent = "Väärä PIN-koodi";
      input.value = "";
      input.focus();
    }
  };

  // Odotetaan että DOM on valmis
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    if (!checkSession()) showPin();
  }
})();
