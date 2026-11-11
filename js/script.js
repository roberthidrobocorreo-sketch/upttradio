/* ============================================================
   UPTT Radio · reproductor en vivo
   >>> Pega aquí la URL de tu stream (Icecast, Shoutcast, Zeno, etc.)
   ============================================================ */
const STREAM_URL = ""; // ej: "https://tu-servidor.com:8000/stream"

(function () {
  const audio  = document.getElementById("stream");
  const play   = document.getElementById("playBtn");
  const label  = document.getElementById("playLabel");
  const status = document.getElementById("status");
  const vol    = document.getElementById("volume");
  const mute   = document.getElementById("muteBtn");

  const paintVolume = () => vol.style.setProperty("--v", vol.value + "%");
  audio.volume = vol.value / 100;
  paintVolume();

  function setPlaying(on) {
    play.setAttribute("aria-pressed", on);
    play.setAttribute("aria-label", on ? "Pausar" : "Reproducir");
    label.textContent = on ? "Estás en Vivo" : "Escúchanos en Vivo";
  }

  play.addEventListener("click", async () => {
    status.textContent = "";
    if (!STREAM_URL) {
      status.textContent = "Falta configurar la URL del stream en js/script.js";
      return;
    }
    if (audio.paused) {
      if (!audio.src) audio.src = STREAM_URL;
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        status.textContent = "No se pudo conectar con la transmisión.";
        setPlaying(false);
      }
    } else {
      audio.pause();
      audio.removeAttribute("src"); // corta el buffer para volver al directo
      audio.load();
      setPlaying(false);
    }
  });

  audio.addEventListener("error", () => {
    if (audio.getAttribute("src")) {
      status.textContent = "La transmisión no está disponible en este momento.";
      setPlaying(false);
    }
  });

  vol.addEventListener("input", () => {
    audio.volume = vol.value / 100;
    audio.muted = false;
    paintVolume();
  });

  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    mute.setAttribute("aria-label", audio.muted ? "Activar sonido" : "Silenciar");
    mute.style.opacity = audio.muted ? ".45" : "1";
  });
})();
