/* ToolNest Share Kit — Phase 8
   Embed widget · Canvas share cards · WhatsApp share · Web Share API · Citation
   100% client-side. No tracking. No external calls except lazy QR library. */
(function () {
  "use strict";

  var QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
  var SITE = "https://toolnest.link/";
  var BRAND = "#1f3d2b", CREAM = "#f2ecd8", ORANGE = "#e07a2c";

  var mount = document.getElementById("tn-share");
  if (!mount) return;

  /* Inside an iframe = embedded copy. Keep it clean, no share bar. */
  var embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  if (embedded) { document.documentElement.classList.add("tn-embedded"); return; }

  /* ---------- page facts ---------- */
  var h1 = document.querySelector("h1");
  var TOOL = (h1 ? h1.textContent : document.title).replace(/\s*\|\s*ToolNest\s*$/i, "").trim();
  var FILE = location.pathname.replace(/^\//, "") || "index.html";
  var URL_ = SITE + FILE;
  var TAG = (function () {
    var m = document.querySelector('meta[name="description"]');
    return m ? m.content : "Free online tool — 100% private, no sign up.";
  })();

  function result() {
    var r = window.TN_RESULT;
    if (typeof r === "function") { try { r = r(); } catch (e) { r = null; } }
    return (typeof r === "string" && r.trim()) ? r.trim() : "";
  }

  /* ---------- tiny helpers ---------- */
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function toast(msg) {
    var t = el("div", "tn-toast", msg);
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("on"); }, 10);
    setTimeout(function () { t.classList.remove("on"); setTimeout(function () { t.remove(); }, 300); }, 2000);
  }
  function copy(text, okMsg) {
    function fallback() {
      var ta = el("textarea"); ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(okMsg || "Copied"); }
      catch (e) { toast("Copy nahi hua — manually select karein"); }
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg || "Copied"); }, fallback);
    } else fallback();
  }

  /* ---------- modal shell ---------- */
  var openModal = null;
  function modal(title, buildBody) {
    closeModal();
    var back = el("div", "tn-modal-back");
    var box = el("div", "tn-modal");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", title);
    var head = el("div", "tn-modal-head");
    head.appendChild(el("h3", null, title));
    var x = el("button", "tn-x", "\u00d7");
    x.setAttribute("aria-label", "Close");
    x.onclick = closeModal;
    head.appendChild(x);
    box.appendChild(head);
    var body = el("div", "tn-modal-body");
    box.appendChild(body);
    back.appendChild(box);
    back.addEventListener("click", function (e) { if (e.target === back) closeModal(); });
    document.body.appendChild(back);
    document.body.style.overflow = "hidden";
    openModal = back;
    buildBody(body);
    x.focus();
    return body;
  }
  function closeModal() {
    if (openModal) { openModal.remove(); openModal = null; document.body.style.overflow = ""; }
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  /* ---------- QR (lazy) ---------- */
  var qrLoading = null;
  function loadQR() {
    if (window.QRCode) return Promise.resolve();
    if (qrLoading) return qrLoading;
    qrLoading = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = QR_LIB; s.async = true;
      s.onload = res;
      s.onerror = function () { rej(new Error("QR library load nahi hui")); };
      document.head.appendChild(s);
    });
    return qrLoading;
  }
  function qrImage(text, size) {
    return loadQR().then(function () {
      return new Promise(function (res, rej) {
        var holder = el("div");
        holder.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(holder);
        try {
          new window.QRCode(holder, {
            text: text, width: size, height: size,
            colorDark: "#000000", colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.M
          });
        } catch (e) { holder.remove(); rej(e); return; }
        setTimeout(function () {
          var c = holder.querySelector("canvas"), i = holder.querySelector("img");
          if (c) { var im = new Image(); im.onload = function () { holder.remove(); res(im); }; im.src = c.toDataURL("image/png"); }
          else if (i) {
            var go = function () { holder.remove(); res(i); };
            if (i.complete && i.naturalWidth) go(); else { i.onload = go; i.onerror = function () { holder.remove(); rej(new Error("QR fail")); }; }
          } else { holder.remove(); rej(new Error("QR fail")); }
        }, 60);
      });
    });
  }

  /* ---------- logo on canvas (matches site SVG) ---------- */
  function drawLogo(x, y, s, ctx) {
    var k = s / 100;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = BRAND;
    ctx.beginPath(); ctx.arc(50, 50, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.lineCap = "round";
    var arcs = [[16, 54, 50, 26, 84, 54], [22, 67, 50, 42, 78, 67], [29, 79, 50, 58, 71, 79]];
    arcs.forEach(function (a) {
      ctx.beginPath(); ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(a[2], a[3], a[4], a[5]); ctx.stroke();
    });
    ctx.fillStyle = ORANGE;
    ctx.beginPath(); ctx.arc(79, 23, 20, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = BRAND; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = BRAND; ctx.font = "bold 16px Arial, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("99", 79, 24);
    ctx.restore();
  }

  function wrap(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + " " + words[i] : words[i];
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; }
      else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  /* ---------- share card ---------- */
  function drawCard(shape, qrImg) {
    var W = shape === "square" ? 1080 : 1200;
    var H = shape === "square" ? 1080 : 630;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");

    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#1f3d2b"); g.addColorStop(1, "#12200f");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(224,122,44,.10)";
    ctx.beginPath(); ctx.arc(W, 0, H * 0.55, 0, Math.PI * 2); ctx.fill();

    var pad = shape === "square" ? 80 : 64;
    var logoS = shape === "square" ? 96 : 76;

    drawLogo(pad, pad, logoS, ctx);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = CREAM;
    ctx.font = "bold " + (shape === "square" ? 54 : 44) + "px Georgia, 'Times New Roman', serif";
    ctx.fillText("ToolNest", pad + logoS + 22, pad + logoS * 0.68);

    var qrS = shape === "square" ? 210 : 170;
    var textW = W - pad * 2 - qrS - 40;
    var y = pad + logoS + (shape === "square" ? 110 : 80);

    ctx.fillStyle = ORANGE;
    ctx.font = "bold " + (shape === "square" ? 40 : 32) + "px system-ui, Segoe UI, Roboto, sans-serif";
    wrap(ctx, TOOL, textW).slice(0, 2).forEach(function (ln) {
      y += shape === "square" ? 50 : 40; ctx.fillText(ln, pad, y);
    });

    var res = result();
    y += shape === "square" ? 42 : 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold " + (shape === "square" ? 56 : 42) + "px system-ui, Segoe UI, Roboto, sans-serif";
    var headline = res || "Free \u00b7 Private \u00b7 No Sign Up";
    wrap(ctx, headline, textW).slice(0, 4).forEach(function (ln) {
      y += shape === "square" ? 68 : 52; ctx.fillText(ln, pad, y);
    });

    if (!res) {
      ctx.fillStyle = "rgba(242,236,216,.72)";
      ctx.font = (shape === "square" ? 30 : 24) + "px system-ui, Segoe UI, Roboto, sans-serif";
      wrap(ctx, TAG, textW).slice(0, 3).forEach(function (ln) {
        y += shape === "square" ? 40 : 32; ctx.fillText(ln, pad, y);
      });
    }

    var qx = W - pad - qrS, qy = H - pad - qrS - 44;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qx - 12, qy - 12, qrS + 24, qrS + 24);
    if (qrImg) ctx.drawImage(qrImg, qx, qy, qrS, qrS);
    ctx.fillStyle = "rgba(242,236,216,.85)";
    ctx.font = (shape === "square" ? 24 : 20) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scan to open", qx + qrS / 2, qy + qrS + 34);

    ctx.textAlign = "left";
    ctx.fillStyle = ORANGE;
    ctx.font = "bold " + (shape === "square" ? 34 : 28) + "px system-ui, sans-serif";
    ctx.fillText("toolnest.link", pad, H - pad + (shape === "square" ? 4 : 0));
    ctx.fillStyle = "rgba(242,236,216,.55)";
    ctx.font = (shape === "square" ? 24 : 20) + "px system-ui, sans-serif";
    ctx.fillText("99 free tools \u00b7 nothing is uploaded", pad, H - pad + (shape === "square" ? 40 : 32));

    return c;
  }

  function cardModal() {
    modal("Share Result Card", function (body) {
      var note = el("p", "tn-note", "Card aap ke browser mein banta hai. Koi upload nahi hota.");
      body.appendChild(note);

      var tabs = el("div", "tn-tabs");
      var bSq = el("button", "tn-tab on", "Square 1080\u00d71080");
      var bLs = el("button", "tn-tab", "Landscape 1200\u00d7630");
      tabs.appendChild(bSq); tabs.appendChild(bLs);
      body.appendChild(tabs);

      var prev = el("div", "tn-prev");
      prev.appendChild(el("p", "tn-note", "Card ban raha hai\u2026"));
      body.appendChild(prev);

      var acts = el("div", "tn-acts");
      body.appendChild(acts);

      var shape = "square", canvas = null, qrImg = null;

      function render() {
        prev.innerHTML = "";
        canvas = drawCard(shape, qrImg);
        canvas.className = "tn-canvas";
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", TOOL + " share card");
        prev.appendChild(canvas);
      }
      function build() {
        acts.innerHTML = "";
        var dl = el("button", "tn-btn tn-primary", "\u2b07 Download PNG");
        dl.onclick = function () {
          if (!canvas) return;
          canvas.toBlob(function (b) {
            if (!b) { toast("Card banane mein masla"); return; }
            var a = el("a");
            a.href = window.URL.createObjectURL(b);
            a.download = FILE.replace(/\.html$/, "") + "-" + shape + ".png";
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { window.URL.revokeObjectURL(a.href); }, 4000);
            toast("Download shuru");
          }, "image/png");
        };
        acts.appendChild(dl);

        if (navigator.canShare) {
          var sh = el("button", "tn-btn", "\ud83d\udcf2 Share Image");
          sh.onclick = function () {
            if (!canvas) return;
            canvas.toBlob(function (b) {
              if (!b) return;
              var f = new File([b], "toolnest-card.png", { type: "image/png" });
              if (!navigator.canShare({ files: [f] })) { toast("Is device par image share support nahi"); return; }
              navigator.share({ files: [f], title: TOOL, text: TOOL + " \u2014 " + URL_ })
                .catch(function () { });
            }, "image/png");
          };
          acts.appendChild(sh);
        }
      }

      bSq.onclick = function () { shape = "square"; bSq.classList.add("on"); bLs.classList.remove("on"); render(); };
      bLs.onclick = function () { shape = "landscape"; bLs.classList.add("on"); bSq.classList.remove("on"); render(); };

      qrImage(URL_, 300).then(function (img) { qrImg = img; render(); build(); })
        .catch(function () { qrImg = null; render(); build(); toast("QR load nahi hua \u2014 card QR ke baghair bana"); });
    });
  }

  /* ---------- embed ---------- */
  function embedModal() {
    modal("Embed This Tool", function (body) {
      body.appendChild(el("p", "tn-note", "Ye code apni website par lagayein \u2014 poora tool wahan chalega. Backlink credit shamil hai."));

      var sizes = [["Responsive", "100%", "760"], ["Compact", "100%", "560"], ["Tall", "100%", "1000"]];
      var w = "100%", h = "760";
      var tabs = el("div", "tn-tabs");
      sizes.forEach(function (s, i) {
        var b = el("button", "tn-tab" + (i === 0 ? " on" : ""), s[0]);
        b.onclick = function () {
          w = s[1]; h = s[2];
          Array.prototype.forEach.call(tabs.children, function (c) { c.classList.remove("on"); });
          b.classList.add("on"); paint();
        };
        tabs.appendChild(b);
      });
      body.appendChild(tabs);

      var lab = el("label", "tn-lab", "Embed code");
      lab.setAttribute("for", "tnEmbedCode");
      body.appendChild(lab);
      var ta = el("textarea", "tn-code");
      ta.id = "tnEmbedCode"; ta.readOnly = true; ta.rows = 7;
      body.appendChild(ta);

      var acts = el("div", "tn-acts");
      var cp = el("button", "tn-btn tn-primary", "\ud83d\udccb Copy Embed Code");
      cp.onclick = function () { copy(ta.value, "Embed code copy ho gaya"); };
      acts.appendChild(cp);
      body.appendChild(acts);

      function paint() {
        ta.value =
          '<iframe src="' + URL_ + '" width="' + w + '" height="' + h + '" ' +
          'style="border:1px solid #ddd;border-radius:12px;max-width:100%" ' +
          'loading="lazy" title="' + TOOL + ' \u2014 ToolNest"></iframe>\n' +
          '<p style="font-size:13px;text-align:center;margin:8px 0 0">' +
          'Powered by <a href="' + SITE + '" target="_blank" rel="noopener">ToolNest Free Online Tools</a></p>';
      }
      paint();
    });
  }

  /* ---------- citation ---------- */
  function citeModal() {
    modal("Cite This Tool", function (body) {
      body.appendChild(el("p", "tn-note", "Research paper, blog ya assignment mein is tool ka hawala dene ke liye."));
      var d = new Date();
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var yr = d.getFullYear(), mo = months[d.getMonth()], dy = d.getDate();
      var out = [
        ["APA (7th)", "ToolNest. (" + yr + "). " + TOOL + " [Online tool]. Retrieved " + mo + " " + dy + ", " + yr + ", from " + URL_],
        ["MLA (9th)", '"' + TOOL + '." ToolNest, ' + yr + ", " + URL_ + ". Accessed " + dy + " " + mo.slice(0, 3) + ". " + yr + "."],
        ["Chicago", '"' + TOOL + '." ToolNest. Accessed ' + mo + " " + dy + ", " + yr + ". " + URL_ + "."],
        ["Harvard", "ToolNest (" + yr + ") " + TOOL + ". Available at: " + URL_ + " (Accessed: " + dy + " " + mo + " " + yr + ")."]
      ];
      out.forEach(function (row) {
        var box = el("div", "tn-cite");
        box.appendChild(el("strong", null, row[0]));
        box.appendChild(el("p", null, row[1]));
        var b = el("button", "tn-btn tn-sm", "Copy");
        b.onclick = function () { copy(row[1], row[0] + " copy ho gaya"); };
        box.appendChild(b);
        body.appendChild(box);
      });
    });
  }

  /* ---------- share bar ---------- */
  function shareText() {
    var r = result();
    return (r ? r + "\n\n" : "") + TOOL + " \u2014 free, private, no sign up:\n" + URL_;
  }

  var bar = el("div", "tn-bar");
  bar.setAttribute("aria-label", "Share and embed this tool");

  var head = el("div", "tn-bar-head");
  head.appendChild(el("h2", null, "Share or Embed This Tool"));
  head.appendChild(el("p", null, "Free to embed on any website. Nothing you enter is shared \u2014 only the link."));
  bar.appendChild(head);

  var btns = el("div", "tn-btns");

  var wa = el("a", "tn-btn tn-wa", "\ud83d\udcac WhatsApp");
  wa.target = "_blank"; wa.rel = "noopener";
  wa.href = "https://wa.me/?text=" + encodeURIComponent(shareText());
  wa.addEventListener("click", function () {
    wa.href = "https://wa.me/?text=" + encodeURIComponent(shareText());
  });
  btns.appendChild(wa);

  var sh = el("button", "tn-btn", navigator.share ? "\ud83d\udce4 Share" : "\ud83d\udd17 Copy Link");
  sh.onclick = function () {
    if (navigator.share) {
      navigator.share({ title: TOOL + " | ToolNest", text: TOOL, url: URL_ }).catch(function () { });
    } else copy(URL_, "Link copy ho gaya");
  };
  btns.appendChild(sh);

  var cd = el("button", "tn-btn", "\ud83d\uddbc Share Card");
  cd.onclick = cardModal;
  btns.appendChild(cd);

  var em = el("button", "tn-btn", "\u2039\u203a Embed");
  em.onclick = embedModal;
  btns.appendChild(em);

  var ct = el("button", "tn-btn", "\ud83d\udcda Cite");
  ct.onclick = citeModal;
  btns.appendChild(ct);

  bar.appendChild(btns);
  mount.appendChild(bar);
})();
