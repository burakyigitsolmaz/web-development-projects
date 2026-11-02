(function () {
  "use strict";

  var card = document.querySelector("#card");
  if (!card) {
    return;
  }

  var frontFace = card.querySelector(".face-front");
  var backFace = card.querySelector(".face-back");
  var flipStatus = document.querySelector("#flipStatus");

  // Tek durum bayrağı: kart arka yüzdeyse true. Çevirme yalnız
  // tıklama / Enter / Space ile olur; hover ile dönüş yoktur.
  var flipped = false;

  var LABEL_FRONT = "Kartvizit kartı, çevirmek için Enter tuşuna bas";
  var LABEL_BACK = "Kartvizit kartı, arka yüz görünüyor; ön yüze dönmek için Enter tuşuna bas";

  // Görünmeyen yüzü sekme sırasından ve erişilebilirlik ağacından çıkarır.
  function setFaceUsable(face, usable) {
    if (!face) {
      return;
    }
    if ("inert" in face) {
      face.inert = !usable;
    }
    face.setAttribute("aria-hidden", usable ? "false" : "true");
  }

  // Çevirme durumunu tek yerden uygular: sınıf + aria-label + canlı bölge
  // duyurusu + inert/aria-hidden senkronizasyonu.
  function setFlipped(state) {
    flipped = state;
    card.classList.toggle("is-flipped", state);
    card.setAttribute("aria-label", state ? LABEL_BACK : LABEL_FRONT);

    if (flipStatus) {
      flipStatus.textContent = state
        ? "Kart arka yüzü gösteriyor"
        : "Kart ön yüzü gösteriyor";
    }


    // Görünen yüz kullanılabilir, gizlenen yüz inert olmalı.
    setFaceUsable(backFace, state);
    setFaceUsable(frontFace, !state);
  }

  // Her tıklama/Enter/Space durumu tersine çevirir.
  function toggleFlip() {
    setFlipped(!flipped);
  }

  // Başlangıçta ön yüz görünür; arka yüz erişilebilirlik ağacının dışında.
  setFlipped(false);

  // --- Tıklama ---
  card.addEventListener("click", function (event) {
    var target = event.target;

    // GitHub/Instagram/mailto gibi bağlantılara tıklanırsa çevirme tetiklenmesin
    var link = target.closest ? target.closest("a") : null;
    if (link) {
      event.stopPropagation();
      return;
    }

    toggleFlip();
  });

  // --- Klavye: sadece kartın kendisi odaktayken çevir ---
  card.addEventListener("keydown", function (event) {
    // Arka yüzdeki <a> gibi bir alt öğe odaktaysa hiçbir şey yapma;
    // preventDefault çağrılmaz, link klavyeyle normal şekilde açılır.
    if (event.target !== card) {
      return;
    }

    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggleFlip();
    }
  });
})();

// ==== Tema ====
(function () {
  "use strict";

  var KEY = "theme";
  var COLORS = { dark: "#0b0b0d", light: "#f1eeec" };
  var root = document.documentElement;
  var btn = document.querySelector("#themeBtn");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function readStored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function store(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function systemTheme() {
    return mq && mq.matches ? "light" : "dark";
  }

  // Temayı uygular: data-theme + tarayıcı çubuğu rengi + düğme etiketi.
  function apply(theme) {
    root.setAttribute("data-theme", theme);

    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute("content", COLORS[theme]);
    }

    if (btn) {
      var label = theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    }
  }

  apply(readStored() || systemTheme());

  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      store(next);
      apply(next);
    });
  }

  // Elle seçim yapılmadıysa sistem temasındaki değişikliği takip et.
  if (mq) {
    var onSystemChange = function () {
      if (!readStored()) {
        apply(systemTheme());
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", onSystemChange);
    } else if (mq.addListener) {
      mq.addListener(onSystemChange);
    }
  }
})();
