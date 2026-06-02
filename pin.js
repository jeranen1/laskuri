// Klasi PIN-suojaus — vaihda PIN muuttamalla KLASI_PIN arvoa
const KLASI_PIN = "040804";

(function() {
  const STORAGE_KEY = "klasi_auth";
  const SESSION_HOURS = 8;

  function onAuth() {
    document.getElementById("pin-overlay").style.display = "none";
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
      <div style="background:#fff;border-radius:16px;padding:32px 24px;width:280px;text-align:center;">
        <div style="font-size:22px;font-weight:700;color:#0B2F5C;margin-bottom:4px;">Klasi Oy</div>
        <div style="font-size:13px;color:#888;margin-bottom:24px;">Syötä PIN-koodi</div>
        <input id="pin-input" type="password" inputmode="numeric" maxlength="6"
          style="width:100%;text-align:center;font-size:28px;letter-spacing:8px;padding:12px;border:2px solid #e0e0e0;border-radius:10px;outline:none;"
          placeholder="••••••">
        <div id="pin-error" style="color:#c62828;font-size:13px;margin-top:10px;min-height:18px;"></div>
        <button onclick="window._klasiCheckPin()"
          style="width:100%;margin-top:12px;padding:14px;background:#0B2F5C;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;">
          Kirjaudu
        </button>
      </div>`;
    document.body.appendChild(overlay);

    const input = document.getElementById("pin-input");
    input.focus();
    input.addEventListener("keydown", e => { if(e.key === "Enter") window._klasiCheckPin(); });
  }

  window._klasiCheckPin = function() {
    const val = document.getElementById("pin-input").value;
    if (val === KLASI_PIN) {
      saveSession();
      onAuth();
    } else {
      document.getElementById("pin-error").textContent = "Väärä PIN-koodi";
      document.getElementById("pin-input").value = "";
      document.getElementById("pin-input").focus();
    }
  };

  if (checkSession()) {
    window.addEventListener("DOMContentLoaded", onAuth);
  } else {
    window.addEventListener("DOMContentLoaded", showPin);
  }
})();
