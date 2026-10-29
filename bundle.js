/* @ds-bundle: {"format":4,"namespace":"MTIVEDesignSystem_6c1254","components":[{"name":"Halftone"}],"sourceHashes":{"components/src/Halftone.js":"c85915236092","ui_kits/marketing/components.jsx":"31bfb612b2c3"}} */

(() => {

const __ds_ns = (window.MTIVEDesignSystem_6c1254 = window.MTIVEDesignSystem_6c1254 || {});

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/src/Halftone.js
try { (() => {
// MTIVE Halftone — turns an image (or the built-in wave field) into the brand's
// dot field, live, inside its container. A shape (the MTIVE mark, a circle, a
// line or an uploaded logo) can send waves through the field: rings that follow
// its outline. Plain JS on window.React; no imports.
function Halftone(props) {
  const React = window.React;
  const {
    src, theme = "dark", shape = "dot", pitch = 14, size = 1, angle = 0,
    contrast = 1.15, brightness = 0, invert = false, warp = 0.45, wave = 760,
    fade = "bottomleft", fadeLength = 0.6,
    waveShape = "none", shapeSrc, shapeX = 0.5, shapeY = 0.5, shapeSize = 0.4, shapeAngle = 0,
    ringGap = 40, ringReach = 0.6, renderScale, mode = "flat", tilt = 40, turn = 0, lift = 0.3, symmetric = true,
    output = "canvas", shapeFill = 0, edge = 1, style, className
  } = props;
  const label = props["aria-label"] || props.ariaLabel || "Halftone image";
  const boxRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const vector = output === "svg";
  const fieldRef = React.useRef({ key: "", field: null });
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [source, setSource] = React.useState(null);
  const [mask, setMask] = React.useState(null);

  // Size: fill the container, follow its resizes.
  React.useEffect(() => {
    const el = boxRef.current; if (!el) return undefined;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Source: the image's luminance, or the generated wave field.
  React.useEffect(() => {
    let alive = true;
    if (!src) { setSource(Halftone.sampleField()); return () => { alive = false; }; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      try { setSource(Halftone.readImage(img)); }
      catch (e) { console.warn("Halftone: cannot read pixels from", src, "(cross-origin). Upload the image to the artifact and pass its /_blob/ url."); setSource(Halftone.sampleField()); }
    };
    img.onerror = () => { if (alive) { console.warn("Halftone: image failed to load:", src); setSource(Halftone.sampleField()); } };
    img.src = src;
    return () => { alive = false; };
  }, [src]);

  // Custom wave shape: read the uploaded logo into a mask.
  const custom = waveShape === "custom";
  React.useEffect(() => {
    let alive = true;
    setMask(null);
    if (!custom) return () => { alive = false; };
    if (!shapeSrc) { setMask("fail"); return () => { alive = false; }; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      try { const m = Halftone.readMask(img); setMask(m || "fail"); if (!m) console.warn("Halftone: no shape found in", shapeSrc); }
      catch (e) { console.warn("Halftone: cannot read pixels from", shapeSrc, "(cross-origin). Upload the logo to the artifact and pass its /_blob/ url."); setMask("fail"); }
    };
    img.onerror = () => { if (alive) { console.warn("Halftone: shape image failed to load:", shapeSrc); setMask("fail"); } };
    img.src = shapeSrc;
    return () => { alive = false; };
  }, [custom, shapeSrc]);

  // Draw whenever size, source or a prop changes.
  React.useEffect(() => {
    const c = vector ? svgRef.current : canvasRef.current; if (!c || !source || box.w < 2 || box.h < 2) return;
    let field = null;
    const kind = custom ? (mask === "fail" ? "mark" : mask ? "custom" : "") : waveShape;
    if (kind && kind !== "none" && Halftone.SHAPES.indexOf(kind) >= 0) {
      const o = {
        kind, mask: kind === "custom" ? mask : null,
        x: num(shapeX, 0.5), y: num(shapeY, 0.5), size: clamp(num(shapeSize, 0.4), 0.02, 2),
        angle: num(shapeAngle, 0) * Math.PI / 180, pitch: Math.max(2, Number(pitch) || 14)
      };
      const key = [box.w, box.h, kind, o.x, o.y, o.size, o.angle, o.pitch, kind === "custom" ? shapeSrc : ""].join("|");
      if (fieldRef.current.key !== key) fieldRef.current = { key, field: Halftone.shapeField(box.w, box.h, o) };
      field = fieldRef.current.field;
    }
    // Backing resolution: at least 2× (sharp when a canvas is zoomed or printed), at most 16 MP.
    const want = renderScale === undefined || renderScale === null || renderScale === "" ? Math.max(2, Math.min(3, window.devicePixelRatio || 1)) : clamp(num(renderScale, 2), 1, 4);
    // Vector output draws in CSS px × 2 (the scale only sets how small a mark may get), then stays sharp at any size.
    const dpr = vector ? 2 : Math.max(1, Math.min(want, Math.sqrt(16e6 / (box.w * box.h))));
    const ctx = vector ? Halftone.svgContext() : c.getContext("2d");
    if (!vector) { c.width = Math.round(box.w * dpr); c.height = Math.round(box.h * dpr); }
    const surface = mode === "surface";
    (surface ? Halftone.drawSurface : Halftone.draw)(ctx, source, {
      W: box.w, H: box.h, scale: dpr, theme, shape, pitch: Math.max(2, Number(pitch) || 14), size: Number(size) || 1,
      angle: (Number(angle) || 0) * Math.PI / 180, contrast: Number(contrast) || 1, brightness: Number(brightness) || 0,
      invert: !!invert, warp: Math.max(0, num(warp, 0.45)), wave: Math.max(40, Number(wave) || 760),
      fade, fadeLength: clamp(num(fadeLength, 0.6), 0.02, 1),
      field, toneFromShape: !src, ringGap: clamp(num(ringGap, 40), 6, 600), ringReach: clamp(num(ringReach, 0.6), 0.02, 2),
      shapeX: num(shapeX, 0.5), shapeCx: num(shapeX, 0.5) * box.w, shapePx: clamp(num(shapeSize, 0.4), 0.02, 2) * Math.min(box.w, box.h),
      tilt: num(tilt, 40), turn: num(turn, 0), lift: clamp(num(lift, 0.3), -1, 2), symmetric: symmetric !== false && symmetric !== "false", shapeFill: clamp(num(shapeFill, 0), 0, 1), edge: clamp(num(edge, 1), 0.1, 1)
    });
    if (vector) c.innerHTML = ctx.svg(box.w * dpr, box.h * dpr);
  }, [vector, box.w, box.h, source, theme, shape, pitch, size, angle, contrast, brightness, invert, warp, wave, fade, fadeLength,
      waveShape, custom, mask, shapeSrc, shapeX, shapeY, shapeSize, shapeAngle, ringGap, ringReach, renderScale, mode, tilt, turn, lift, symmetric, shapeFill, edge, src]);

  const ground = theme === "paper" ? "#FFFFFF" : "#000000";
  return React.createElement("div", {
    ref: boxRef, className, role: "img", "aria-label": label,
    style: Object.assign({ position: "relative", width: "100%", height: "100%", minHeight: 40, overflow: "hidden", background: ground }, style)
  }, vector
    ? React.createElement("div", { ref: svgRef, "aria-hidden": "true", style: { position: "absolute", inset: 0, lineHeight: 0 } })
    : React.createElement("canvas", { ref: canvasRef, "aria-hidden": "true", style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" } }));

  function num(v, d) { const n = Number(v); return v === undefined || v === null || v === "" || isNaN(n) ? d : n; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
}

Halftone.SHAPES = ["mark", "circle", "line", "custom"];

// A stand-in for a canvas 2D context that records the marks as SVG paths: the same drawing
// code then yields vector artwork (print, large format, crisp PDFs).
Halftone.svgContext = function () {
  const parts = [];
  let m = [1, 0, 0, 1, 0, 0], d = [], fill = "#000000", ground = null;
  const f = (v) => String(Math.round(v * 10) / 10);
  const pt = (x, y) => f(m[0] * x + m[2] * y + m[4]) + " " + f(m[1] * x + m[3] * y + m[5]);
  return {
    get fillStyle() { return fill; }, set fillStyle(v) { fill = v; },
    setTransform(a, b, c, dd, e, g) { m = [a, b, c, dd, e, g]; },
    fillRect(x, y, w, h) { if (!ground) ground = fill; },
    beginPath() { d = []; },
    moveTo(x, y) { d.push("M" + pt(x, y)); },
    lineTo(x, y) { d.push("L" + pt(x, y)); },
    closePath() { d.push("Z"); },
    // Full circles only (that is all the halftone draws). Under the current transform a circle is an
    // ellipse: its axes come from the transform's singular values, written as two SVG arcs.
    arc(cx, cy, r) {
      if (d.length && d[d.length - 1][0] === "M") d.pop();
      const a = m[0] * r, b = m[1] * r, c = m[2] * r, e = m[3] * r;
      const X = m[0] * cx + m[2] * cy + m[4], Y = m[1] * cx + m[3] * cy + m[5];
      const sxx = a * a + c * c, syy = b * b + e * e, sxy = a * b + c * e, tr = (sxx + syy) / 2, df = Math.hypot((sxx - syy) / 2, sxy);
      const rx = Math.sqrt(tr + df), ry = Math.sqrt(Math.max(0, tr - df)), th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
      if (ry < 0.05) return;
      // Two half-ellipse arcs. The radius is written at or just under half the (rounded) chord: SVG then
      // fits it exactly to the endpoints. A radius even slightly over half would bulge each arc outward.
      const ux = rx * Math.cos(th), uy = rx * Math.sin(th);
      const dx = Math.round(-200 * ux) / 100, dy = Math.round(-200 * uy) / 100, hc = Math.hypot(dx, dy) / 2;
      const rxo = Math.floor(hc * 100) / 100; if (rxo <= 0) return;
      const A = "a" + rxo + " " + Math.round(ry * rxo / rx * 100) / 100 + " " + f(th * 180 / Math.PI) + " 1 0 ";
      d.push("M" + f(X + ux) + " " + f(Y + uy) + A + dx + " " + dy + A + (-dx) + " " + (-dy) + "z");
    },
    fill() { if (d.length) parts.push('<path fill="' + fill + '" d="' + d.join("") + '"/>'); d = []; },
    svg(w, h) {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + f(w) + " " + f(h) + '" width="100%" height="100%" preserveAspectRatio="none">' +
        (ground ? '<rect width="' + f(w) + '" height="' + f(h) + '" fill="' + ground + '"/>' : "") + parts.join("") + "</svg>";
    }
  };
};

// The same artwork as a standalone SVG file, for export. props as for the component; width and height in CSS px.
Halftone.toSVG = function (props, width, height) {
  const P = props || {}, n = (v, dflt) => (v === undefined || v === null || v === "" || isNaN(Number(v)) ? dflt : Number(v));
  const W = width, H = height, pitch = Math.max(2, n(P.pitch, 14)), kind = P.waveShape && P.waveShape !== "none" && P.waveShape !== "custom" ? P.waveShape : null;
  const field = kind ? Halftone.shapeField(W, H, { kind, x: n(P.shapeX, 0.5), y: n(P.shapeY, 0.5), size: n(P.shapeSize, 0.4), angle: n(P.shapeAngle, 0) * Math.PI / 180, pitch }) : null;
  const ctx = Halftone.svgContext();
  (P.mode === "surface" ? Halftone.drawSurface : Halftone.draw)(ctx, P.source || Halftone.sampleField(), {
    W, H, scale: 2, theme: P.theme || "dark", shape: P.shape || "dot", pitch, size: n(P.size, 1), angle: n(P.angle, 0) * Math.PI / 180,
    contrast: n(P.contrast, 1.15), brightness: n(P.brightness, 0), invert: !!P.invert, warp: n(P.warp, 0.45), wave: Math.max(40, n(P.wave, 760)),
    fade: P.fade || "bottomleft", fadeLength: n(P.fadeLength, 0.6), field, toneFromShape: !P.source, ringGap: n(P.ringGap, 40), ringReach: n(P.ringReach, 0.6),
    shapeX: n(P.shapeX, 0.5), shapeCx: n(P.shapeX, 0.5) * W, shapePx: n(P.shapeSize, 0.4) * Math.min(W, H),
    tilt: n(P.tilt, 40), turn: n(P.turn, 0), lift: n(P.lift, 0.3), symmetric: P.symmetric !== false, shapeFill: n(P.shapeFill, 0), edge: n(P.edge, 1)
  });
  return ctx.svg(W * 2, H * 2).replace('width="100%" height="100%"', 'width="' + W + '" height="' + H + '"');
};

// The MTIVE mark, from the vector master (viewBox 429.35 520 1141.88 958.5).
Halftone.MARK = {
  x: 429.35, y: 520, w: 1141.88, h: 958.5,
  d: "M982.67 520.33L982.33 520L705.84 520.25L429.35 520.5L566.73 758.5L704.12 996.5L839.74 1231.5L975.36 1466.5L978.93 1472.5L982.5 1478.5L982.75 999.58L983 520.67Z" +
     "M1244.55 1085.5L1470.23 694.5L1519.27 609.5L1568.32 524.5L1569.77 522.25L1571.23 520L1294.12 520L1017 520L1017 999.2L1017 1478.4L1017.93 1477.45L1018.86 1476.5Z"
};

Halftone.sampleField = function () {
  if (Halftone._sample) return Halftone._sample;
  const w = 800, h = 450, lum = new Float32Array(w * h);
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h;
    const base = 1 - sm(0.2, 0.8, v * 0.9 + (0.45 - u) * 0.45);
    const m = 0.72 + 0.28 * Math.sin(7 * u + 2.6 * Math.sin(4.5 * v)) * Math.cos(5.5 * v - 1.8 * u);
    lum[y * w + x] = Math.max(0, Math.min(1, base * m * 0.92));
  }
  return (Halftone._sample = { lum, w, h });
};

Halftone.readImage = function (img) {
  const max = 1200, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data, lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255 * (d[i * 4 + 3] / 255);
  return { lum, w, h };
};

// A logo image to a shape mask. Transparent logos: the opaque pixels are the
// shape. Opaque images: the pixels that differ from the corner colour.
Halftone.readMask = function (img) {
  const nw = img.naturalWidth || 512, nh = img.naturalHeight || 512, k = Math.min(1, 1024 / Math.max(nw, nh));
  const w = Math.max(1, Math.round(nw * k)), h = Math.max(1, Math.round(nh * k));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
  const id = g.getImageData(0, 0, w, h), d = id.data, n = w * h;
  let clear = 0; for (let i = 0; i < n; i++) if (d[i * 4 + 3] < 250) clear++;
  const lum = (i) => (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  const bg = (lum(0) + lum(w - 1) + lum(n - w) + lum(n - 1)) / 4, alpha = clear > n * 0.02;
  let count = 0;
  for (let i = 0; i < n; i++) {
    const on = alpha ? d[i * 4 + 3] > 127 : Math.abs(lum(i) - bg) > 0.35;
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255; d[i * 4 + 3] = on ? 255 : 0; if (on) count++;
  }
  if (!count || count === n) return null;
  g.putImageData(id, 0, 0);
  return { canvas: c, w, h };
};

// Signed distance (CSS px) from every point of a W×H box to the shape's
// outline: negative inside, positive outside.
Halftone.shapeField = function (W, H, o) {
  const q = Math.max(1.25, Math.min(Math.sqrt(W * H / 110000), (o.pitch || 8) * 0.6)), m = Math.ceil(0.15 * Math.max(W, H) / q);
  const cw = Math.ceil(W / q) + 2 * m, ch = Math.ceil(H / q) + 2 * m, S = o.size * Math.min(W, H);
  const c = document.createElement("canvas"); c.width = cw; c.height = ch;
  const g = c.getContext("2d");
  g.setTransform(1 / q, 0, 0, 1 / q, m, m); g.translate(o.x * W, o.y * H); g.rotate(o.angle);
  g.fillStyle = "#FFFFFF";
  if (o.kind === "circle") { g.beginPath(); g.arc(0, 0, S / 2, 0, Math.PI * 2); g.fill(); }
  else if (o.kind === "line") { const L = 4 * Math.hypot(W, H), t = Math.max(2 * q, S * 0.1); g.fillRect(-L / 2, -t / 2, L, t); }
  else if (o.kind === "custom" && o.mask) {
    const k = S / Math.max(o.mask.w, o.mask.h), dw = o.mask.w * k, dh = o.mask.h * k;
    g.drawImage(o.mask.canvas, -dw / 2, -dh / 2, dw, dh);
  } else {
    const M = Halftone.MARK, k = S / Math.max(M.w, M.h);
    g.scale(k, k); g.translate(-M.x - M.w / 2, -M.y - M.h / 2); g.fill(new Path2D(M.d));
  }
  const px = g.getImageData(0, 0, cw, ch).data, n = cw * ch, INF = 1e20;
  const out = new Float64Array(n), inn = new Float64Array(n);
  let any = false;
  for (let i = 0; i < n; i++) { const on = px[i * 4 + 3] > 127; out[i] = on ? 0 : INF; inn[i] = on ? INF : 0; if (on) any = true; }
  if (!any) return null;
  Halftone.edt(out, cw, ch); Halftone.edt(inn, cw, ch);
  const d = new Float32Array(n);
  for (let i = 0; i < n; i++) d[i] = (Math.sqrt(out[i]) - Math.sqrt(inn[i])) * q;
  return { d, w: cw, h: ch, q, m };
};

// Exact squared Euclidean distance transform (Felzenszwalb & Huttenlocher).
Halftone.edt = function (grid, w, h) {
  const len = Math.max(w, h), f = new Float64Array(len), dd = new Float64Array(len), v = new Int32Array(len), z = new Float64Array(len + 1);
  const pass = (n) => {
    let k = 0; v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
    for (let q = 1; q < n; q++) {
      let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
    }
    k = 0;
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; dd[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = grid[y * w + x]; pass(h); for (let y = 0; y < h; y++) grid[y * w + x] = dd[y]; }
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = grid[y * w + x]; pass(w); for (let x = 0; x < w; x++) grid[y * w + x] = dd[x]; }
};

Halftone.draw = function (ctx, src, p) {
  const s = p.scale, W = p.W * s, H = p.H * s, pitch = p.pitch * s, lam = p.wave * s, F = p.field;
  const A = F ? 0 : p.warp * lam * 0.16;
  const gap = (p.ringGap || 40) * s, pull = p.warp * gap * 0.22, wob = p.warp * gap * 0.3, reach = (p.ringReach || 0.6) * Math.hypot(W, H) * 0.5;
  const k = Math.max(W / src.w, H / src.h), ox = (W - src.w * k) / 2, oy = (H - src.h * k) / 2;
  const ca = Math.cos(p.angle), sa = Math.sin(p.angle), cx = W / 2, cy = H / 2;
  const n = Math.ceil((Math.hypot(W, H) / 2 + pitch * 2 + A + pull) / pitch), TAU = Math.PI * 2;
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // Signed distance at device px (x, y), bilinear.
  const dist = (x, y) => {
    let fx = x / s / F.q + F.m - 0.5, fy = y / s / F.q + F.m - 0.5;
    fx = Math.min(F.w - 1.001, Math.max(0, fx)); fy = Math.min(F.h - 1.001, Math.max(0, fy));
    const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, r = j * F.w + i, D = F.d;
    return ((D[r] * (1 - u) + D[r + 1] * u) * (1 - v) + (D[r + F.w] * (1 - u) + D[r + F.w + 1] * u) * v) * s;
  };
  const dark = p.theme !== "paper";
  // Fine dots leave gaps that read grey: inside the wave shape they grow until they close up
  // (fully at pitch 4 and below, not at all from pitch 8, so coarse fields keep their dot texture).
  const solid = 1.12 + 0.38 * Math.min(1, Math.max(0, (8 - p.pitch) / 4));
  ctx.fillStyle = dark ? "#000000" : "#FFFFFF"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = dark ? "#FFFFFF" : "#000000"; ctx.beginPath();
  let batch = 0; // fill in batches: one huge path is slow to rasterise
  for (let j = -n; j <= n; j++) for (let i = -n; i <= n; i++) {
    if (++batch > 4000) { ctx.fill(); ctx.beginPath(); batch = 0; }
    const gx = i * pitch, gy = j * pitch;
    let x = cx + gx * ca - gy * sa, y = cy + gx * sa + gy * ca, dd = 0;
    if (A > 0) {
      x += A * Math.sin(TAU * y / lam + 1.3 * Math.sin(TAU * x / (1.7 * lam)));
      y += A * 0.6 * Math.sin(TAU * x / (0.8 * lam) + 0.7);
    }
    if (F) {
      // Waves from the shape: wobble the rings, pull marks onto their crests.
      if (x < -gap * 2 || y < -gap * 2 || x > W + gap * 2 || y > H + gap * 2) continue;
      dd = dist(x, y);
      if (dd > 0) {
        const e = F.q * s, nx = dist(x + e, y) - dist(x - e, y), ny = dist(x, y + e) - dist(x, y - e), nl = Math.hypot(nx, ny) || 1;
        const w = wob * Math.min(1, dd / gap) * Math.sin(TAU * y / lam + 1.3 * Math.cos(TAU * (x - (p.shapeCx || 0) * s) / (1.7 * lam)));
        const delta = -pull * Math.sin(TAU * (dd + w) / gap); // pull onto the crests at k·gap
        x += delta * nx / nl; y += delta * ny / nl; dd += delta + w;
      }
    }
    if (x < -pitch || y < -pitch || x > W + pitch || y > H + pitch) continue;
    // Tone: ink from the shape's rings, or the image (with the rings cut into it).
    let t, ink = false;
    // The first crest sits on the outline: its ink fills details finer than a mark, so small logos stay solid.
    const ring = F ? (dd <= 0 ? 1 : Math.pow(Math.max(0, (Math.cos(TAU * dd / gap) + 0.25) / 1.25), 1.3)) : 1;
    const env = F ? (dd <= 0 ? 1 : Math.exp(-dd / reach)) : 0;
    if (F && p.toneFromShape) { t = env * ring; ink = true; }
    else {
      const sx = Math.min(src.w - 1, Math.max(0, Math.round((x - ox) / k)));
      const sy = Math.min(src.h - 1, Math.max(0, Math.round((y - oy) / k)));
      t = src.lum[sy * src.w + sx];
    }
    let l = 0.5 + (t + p.brightness - 0.5) * p.contrast;
    l = Math.min(1, Math.max(0, l)); if (p.invert) l = 1 - l;
    if (!ink && F) { const a = (dark ? l : 1 - l) * (1 - env * (1 - ring) * 0.9); l = dark ? a : 1 - a; }
    let f = 1;
    if (p.fade && p.fade !== "none" && !(ink && dd <= 0)) { // the shape itself stays solid
      const u = x / W, v = y / H;
      const ft = p.fade === "bottom" ? v : p.fade === "left" ? 1 - u : p.fade === "radial" ? Math.min(1, Math.hypot(u - 0.5, v - 0.5) / 0.7071) : (v + (1 - u)) / 2;
      f = 1 - sm(1 - p.fadeLength, 1, ft);
    }
    const c = (dark || ink ? l : 1 - l) * f; if (c <= 0.002) continue;
    if (p.shape === "square" || p.shape === "line") {
      // +0.6 device px so full-tone marks overlap: no hairline seams in solid areas.
      const hw = p.shape === "square" ? pitch * 0.5 * Math.sqrt(c) * p.size + 0.6 * c : pitch * 0.5 + 0.6;
      const hh = p.shape === "square" ? hw : pitch * 0.5 * c * p.size; if (hh < 0.12) continue;
      ctx.moveTo(x - hw * ca + hh * sa, y - hw * sa - hh * ca);
      ctx.lineTo(x + hw * ca + hh * sa, y + hw * sa - hh * ca);
      ctx.lineTo(x + hw * ca - hh * sa, y + hw * sa + hh * ca);
      ctx.lineTo(x - hw * ca - hh * sa, y - hw * sa + hh * ca);
      ctx.closePath();
    } else {
      const r = pitch * 0.5 * Math.sqrt(c) * p.size * (ink && dd <= 0 ? solid : 1.12); if (r < 0.25) continue;
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
    }
  }
  ctx.fill();
};

// 3D surface: the halftone as a draped sheet of dot rows (left to right) seen at an angle,
// lit from above. A wave shape floats in it: the sheet rises over the shape and settles back
// into the waves. Waves mirror around the shape's axis when `symmetric`.
Halftone.drawSurface = function (ctx, src, p) {
  const TAU = Math.PI * 2, s = p.scale, W = p.W, H = p.H;
  const cl = (v, a, b) => Math.min(b, Math.max(a, v));
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const t = cl(p.tilt, 0, 75) * Math.PI / 180, r = cl(p.turn, -60, 60) * Math.PI / 180;
  const ct = Math.cos(t), st = Math.sin(t), cr = Math.cos(r), sr = Math.sin(r);
  const f = 1.4 * Math.max(W, H), F = f, cx = W / 2, cy = H / 2;
  const pitch = p.pitch, lam = p.wave, A = p.warp * lam * 0.36;
  const Fd = p.field, S = p.shapePx || 0, lift = Fd ? p.lift * S : 0;
  const x0 = Fd ? (p.shapeX - 0.5) * W : 0, E = Math.min(1, Math.max(0.1, p.edge == null ? 1 : p.edge)), soft = 0.1 * E * S, bevel = 0.04 * E * E * S, calmR = 0.32 * S, shadeR = 0.25 * S;
  // Signed distance to the shape (CSS px), sampled on the sheet: Y is pre-stretched by 1/cos(tilt)
  // so the shape keeps its proportions once the sheet is tilted.
  const dist = (X, Y) => {
    let fx = (X + W / 2) / Fd.q + Fd.m - 0.5, fy = (Y * ct + H / 2) / Fd.q + Fd.m - 0.5;
    fx = cl(fx, 0, Fd.w - 1.001); fy = cl(fy, 0, Fd.h - 1.001);
    const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, k = j * Fd.w + i, D = Fd.d;
    return (D[k] * (1 - u) + D[k + 1] * u) * (1 - v) + (D[k + Fd.w] * (1 - u) + D[k + Fd.w + 1] * u) * v;
  };
  const height = (X, Y) => {
    const dx = X - x0;
    let h = p.symmetric
      ? 0.6 * Math.cos(TAU * dx / (1.3 * lam)) * Math.cos(TAU * Y / (1.9 * lam) + 0.9 * Math.cos(TAU * dx / (2.2 * lam)))
        + 0.4 * Math.cos(TAU * Y / (1.5 * lam) + 1.4 * Math.cos(TAU * dx / (1.6 * lam)) + 2.2)
      : 0.6 * Math.sin(TAU * X / (1.3 * lam) + 0.9 * Math.sin(TAU * Y / (1.7 * lam)))
        + 0.4 * Math.cos(TAU * Y / (0.8 * lam) + 1.4 * Math.sin(TAU * X / (1.6 * lam)));
    h *= A;
    if (Fd) {
      // Calm water around the floating shape, a flat top on it.
      const d = dist(X, Y), core = sm(soft, -bevel, d), calm = sm(calmR, 0, d);
      h = h * (1 - 0.7 * calm) * (1 - core) + lift * core;
    }
    return h;
  };
  // Sheet extent: invert the projection of the top and bottom screen edges, plus a margin.
  const m = (A + lift) * 1.6 + 3 * pitch;
  const Yat = (k) => k * F / (ct + k * st);
  const Ytop = Math.max(Yat(-cy / f) - m / Math.max(0.3, ct), -0.9 * F / Math.max(0.05, st));
  const Ybot = Math.min(Yat((H - cy) / f) + m, 0.8 * F / Math.max(0.05, st));
  const zmax = F - Ytop * st;
  const Xmax = ((W / 2) / f * zmax + m) * (1 + Math.abs(sr)) + Math.abs(sr) * (Ybot - Ytop);
  let nx = Math.ceil(2 * Xmax / pitch) + 1, ny = Math.ceil((Ybot - Ytop) / pitch) + 1;
  if (nx * ny > 900000) nx = Math.floor(900000 / ny);
  const N = nx * ny, PX = new Float32Array(N), PY = new Float32Array(N), RX = new Float32Array(N), RY = new Float32Array(N), RZ = new Float32Array(N);
  const ok = new Uint8Array(N), U = new Float32Array(N), V = new Float32Array(N), SD = Fd ? new Float32Array(N) : null;
  const X0 = -((nx - 1) * pitch) / 2;
  for (let j = 0; j < ny; j++) {
    const Y = Ytop + j * pitch;
    for (let i = 0; i < nx; i++) {
      const X = X0 + i * pitch, h = height(X, Y), k = j * nx + i;
      const y1 = Y * ct - h * st, z1 = -Y * st - h * ct;
      const x2 = X * cr + z1 * sr, z2 = -X * sr + z1 * cr + F;
      RX[k] = x2; RY[k] = y1; RZ[k] = z2; U[k] = (X + W / 2) / W; V[k] = (Y * ct + H / 2) / H; if (SD) SD[k] = dist(X, Y);
      if (z2 > 0.12 * F) { PX[k] = (cx + f * x2 / z2) * s; PY[k] = (cy + f * y1 / z2) * s; ok[k] = 1; }
    }
  }
  // Light from above and in front, centred, so the shading stays symmetric.
  const Lx = 0, Ly = -0.62, Lz = -0.78;
  const dark = p.theme !== "paper", Wd = Math.ceil(W * s), Hd = Math.ceil(H * s);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = dark ? "#000000" : "#FFFFFF"; ctx.fillRect(0, 0, Wd, Hd);
  ctx.fillStyle = dark ? "#FFFFFF" : "#000000"; ctx.beginPath();
  const horizon = new Float32Array(Wd + 2).fill(1e9);
  const runX = new Float32Array(nx), runY = new Float32Array(nx), runW = new Float32Array(nx * 2);
  let batch = 0;
  const flush = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fill(); ctx.beginPath(); batch = 0; };
  // Rows from near (bottom) to far (top): a point shows only if it rises above everything nearer.
  for (let j = ny - 1; j >= 0; j--) {
    const vis = new Uint8Array(nx), cs = new Float32Array(nx), fb = new Float32Array(nx);
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i; if (!ok[k]) continue;
      const x = PX[k], y = PY[k];
      if (x < -pitch * 4 * s || x > Wd + pitch * 4 * s || y < -pitch * 4 * s || y > Hd + pitch * 4 * s) continue;
      const col = Math.round(cl(x, 0, Wd + 1));
      if (y > horizon[col] + 0.75 * s) continue;
      // Tone: Lambert light on the sheet's normal (or the image draped on it).
      const kl = j * nx + Math.max(0, i - 1), kr = j * nx + Math.min(nx - 1, i + 1);
      const ku = Math.max(0, j - 1) * nx + i, kd = Math.min(ny - 1, j + 1) * nx + i;
      const ax = RX[kr] - RX[kl], ay = RY[kr] - RY[kl], az = RZ[kr] - RZ[kl];
      const bx = RX[kd] - RX[ku], by = RY[kd] - RY[ku], bz = RZ[kd] - RZ[ku];
      let nxv = ay * bz - az * by, nyv = az * bx - ax * bz, nzv = ax * by - ay * bx;
      const nl = Math.hypot(nxv, nyv, nzv) || 1; nxv /= nl; nyv /= nl; nzv /= nl;
      if (nxv * RX[k] + nyv * RY[k] + nzv * RZ[k] > 0) { nxv = -nxv; nyv = -nyv; nzv = -nzv; }
      const lit = Math.max(0, nxv * Lx + nyv * Ly + nzv * Lz);
      let tone;
      if (src && !p.toneFromShape) {
        const sx = Math.min(src.w - 1, Math.max(0, Math.round(U[k] * (src.w - 1))));
        const sy = Math.min(src.h - 1, Math.max(0, Math.round(V[k] * (src.h - 1))));
        tone = src.lum[sy * src.w + sx]; if (!dark) tone = 1 - tone; tone *= 0.45 + 0.55 * lit;
      } else tone = 0.08 + 0.92 * Math.pow(lit, 2.2);
      if (SD) {
        // The floating top catches more light; the sheet just around it lies in its shadow.
        const d = SD[k];
        if (d <= soft) tone = tone * (1 + 0.3 * sm(soft, -bevel, d));
        else tone *= 1 - 0.55 * Math.exp(-(d - soft) / shadeR);
      }
      let l = 0.5 + (tone + p.brightness - 0.5) * p.contrast; l = cl(l, 0, 1); if (p.invert) l = 1 - l;
      let fd = 1;
      if (p.fade && p.fade !== "none") {
        const u = x / Wd, v = y / Hd;
        const ft = p.fade === "bottom" ? v : p.fade === "left" ? 1 - u : p.fade === "radial" ? Math.min(1, Math.hypot(u - 0.5, v - 0.5) / 0.7071) : (v + (1 - u)) / 2;
        fd = 1 - sm(1 - p.fadeLength, 1, ft);
      }
      // Far edge: where the rows crowd closer than about a third of the pitch they can no longer be
      // drawn apart and shimmer (moiré); fade them out before that point.
      const kn = Math.min(ny - 1, j + 1) * nx + i, gap = Math.hypot(PX[kn] - PX[k], PY[kn] - PY[k]) / (s * pitch);
      const far = j === ny - 1 ? 1 : sm(0.3, 0.6, gap);
      const c = (dark ? l : 0.42 + 0.58 * (1 - l)) * fd * far; if (c <= 0.004) continue;
      // shapeFill: the floating shape's top reads as a solid emblem (marks grow until they close up).
      const fill = SD && p.shapeFill > 0 ? p.shapeFill * sm(bevel, -bevel, SD[k]) : 0;
      vis[i] = 1; cs[i] = c + (1 - c) * fill; fb[i] = fill;
    }
    // Marks for this row.
    if (p.shape === "line") {
      let n = 0;
      const emit = () => {
        if (n > 1) {
          ctx.moveTo(runX[0] - runW[0], runY[0] - runW[1]);
          for (let q = 1; q < n; q++) ctx.lineTo(runX[q] - runW[q * 2], runY[q] - runW[q * 2 + 1]);
          for (let q = n - 1; q >= 0; q--) ctx.lineTo(runX[q] + runW[q * 2], runY[q] + runW[q * 2 + 1]);
          ctx.closePath(); batch += n;
        }
        n = 0;
      };
      for (let i = 0; i < nx; i++) {
        if (!vis[i]) { emit(); continue; }
        const k = j * nx + i, ku = Math.max(0, j - 1) * nx + i, kd = Math.min(ny - 1, j + 1) * nx + i;
        const w = (0.11 + 0.42 * fb[i]) * p.size * cs[i];
        runX[n] = PX[k]; runY[n] = PY[k]; runW[n * 2] = (PX[kd] - PX[ku]) * w; runW[n * 2 + 1] = (PY[kd] - PY[ku]) * w; n++;
      }
      emit();
    } else {
      for (let i = 0; i < nx; i++) {
        if (!vis[i]) continue;
        const k = j * nx + i, kl = j * nx + Math.max(0, i - 1), kr = j * nx + Math.min(nx - 1, i + 1);
        const ku = Math.max(0, j - 1) * nx + i, kd = Math.min(ny - 1, j + 1) * nx + i;
        const rr = (p.shape === "square" ? 0.16 + 0.38 * fb[i] : 0.19 + 0.45 * fb[i]) * Math.sqrt(cs[i]) * p.size;
        const ax = (PX[kr] - PX[kl]) * rr, ay = (PY[kr] - PY[kl]) * rr, bx = (PX[kd] - PX[ku]) * rr, by = (PY[kd] - PY[ku]) * rr;
        if (Math.abs(ax * by - ay * bx) < 0.04) continue;
        if (p.shape === "square") {
          const x = PX[k], y = PY[k];
          ctx.moveTo(x - ax - bx, y - ay - by); ctx.lineTo(x + ax - bx, y + ay - by);
          ctx.lineTo(x + ax + bx, y + ay + by); ctx.lineTo(x - ax + bx, y - ay + by); ctx.closePath();
        } else {
          ctx.setTransform(ax, ay, bx, by, PX[k], PY[k]); ctx.moveTo(1, 0); ctx.arc(0, 0, 1, 0, TAU);
        }
        if (++batch > 4000) flush();
      }
    }
    if (batch > 4000) flush();
    // Raise the horizon to this row's outline.
    let px = -1, py = 0;
    for (let i = 0; i < nx; i++) {
      const k = j * nx + i; if (!ok[k]) { px = -1; continue; }
      const x = PX[k], y = PY[k];
      if (px >= 0 || px === -1) {
        if (px !== -1) {
          const a = Math.max(0, Math.ceil(Math.min(px, x))), b = Math.min(Wd + 1, Math.floor(Math.max(px, x)));
          for (let c = a; c <= b; c++) { const tt = x === px ? 0 : (c - px) / (x - px); const yy = py + (y - py) * tt; if (yy < horizon[c]) horizon[c] = yy; }
        }
      }
      px = x; py = y;
    }
  }
  flush();
};

__ds_ns.Halftone = Halftone;
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/src/Halftone.js", error: String((e && e.message) || e) }); }

// ui_kits/marketing/components.jsx
try { (() => {
const {
  useState
} = React;
function Nav({
  active,
  onNav
}) {
  const links = ['Platform', 'Services', 'Deployments', 'Company'];
  return /*#__PURE__*/React.createElement("nav", {
    className: "mk-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container mk-nav-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-nav-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark-white.png",
    alt: "MTIVE mark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "wm"
  }, "MTIVE")), /*#__PURE__*/React.createElement("div", {
    className: "mk-nav-links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav?.(l);
    },
    className: active === l ? 'is-active' : ''
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "mk-nav-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mk-btn mk-btn--sm"
  }, "Request briefing"))));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mk-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-hero-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-lines mt-lines--draw mk-hero-lines"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "mk-eyebrow"
  }, "MTIVE Solutions"), /*#__PURE__*/React.createElement("h1", null, "Autonomy where people should not go."), /*#__PURE__*/React.createElement("p", {
    className: "mk-lead"
  }, "MTIVE Solutions builds autonomous systems for high-risk environments and supports them for their whole service life."), /*#__PURE__*/React.createElement("div", {
    className: "mk-hero-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mk-btn"
  }, "Request briefing"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "mk-link",
    onClick: e => e.preventDefault()
  }, "Read the overview"))), /*#__PURE__*/React.createElement("div", {
    className: "mk-hero-media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-ph mk-ph--field",
    "data-label": "FIELD IMAGERY"
  })));
}
function Capabilities() {
  const caps = [{
    n: '01',
    t: 'Site assessment',
    d: 'Survey, risk review and a written plan before anything ships.'
  }, {
    n: '02',
    t: 'Deployment',
    d: 'Installed and handed over by the people who built it.'
  }, {
    n: '03',
    t: 'Operator training',
    d: 'Hands-on sessions until the team runs it without help.'
  }, {
    n: '04',
    t: 'Support',
    d: 'A direct line to engineering for the life of the system.'
  }, {
    n: '05',
    t: 'Maintenance',
    d: 'Scheduled service and spare parts, planned a year ahead.'
  }, {
    n: '06',
    t: 'Reporting',
    d: 'Plain-language reports on what the system did and when.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "mk-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-section-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-eyebrow"
  }, "Services"), /*#__PURE__*/React.createElement("h2", null, "From first survey to long-term support."), /*#__PURE__*/React.createElement("p", {
    className: "mk-lead"
  }, "One team owns the work end to end, so nothing gets lost between handovers.")), /*#__PURE__*/React.createElement("div", {
    className: "mk-grid-3"
  }, caps.map(c => /*#__PURE__*/React.createElement("div", {
    className: "mk-cap",
    key: c.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, c.n), /*#__PURE__*/React.createElement("h3", null, c.t), /*#__PURE__*/React.createElement("p", null, c.d))))));
}
function Statement() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mk-statement"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-eyebrow"
  }, "Principle"), /*#__PURE__*/React.createElement("p", {
    className: "mk-statement-line"
  }, "Every system ships with the people who built it.")));
}
function SpecBlock() {
  const rows = [['Dimensions', '000 × 000 × 000 mm'], ['Weight', '00.0 kg'], ['Power', '000 W'], ['Operating temp.', '−00 to 00 °C'], ['Ingress rating', 'IP00'], ['Lead time', '00 weeks']];
  return /*#__PURE__*/React.createElement("section", {
    className: "mk-section mk-section--line"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container mk-spec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-spec-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-eyebrow"
  }, "Product \xB7 Spec sheet"), /*#__PURE__*/React.createElement("h2", null, "The numbers,", /*#__PURE__*/React.createElement("br", null), "stated plainly."), /*#__PURE__*/React.createElement("p", {
    className: "mk-lead"
  }, "Every figure on a spec sheet is measured, with the conditions it was measured under. Zeros mark the format until real values exist.")), /*#__PURE__*/React.createElement("div", {
    className: "mk-spec-rows"
  }, rows.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    className: "mk-spec-row",
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, v))))));
}
function CtaBand() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mk-cta-band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container"
  }, /*#__PURE__*/React.createElement("h2", null, "Briefings are available by appointment."), /*#__PURE__*/React.createElement("div", {
    className: "mk-cta-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mk-btn"
  }, "Request briefing"), /*#__PURE__*/React.createElement("span", {
    className: "mk-cta-meta"
  }, "Reply within 72 hours"))));
}
function Footer() {
  const cols = [['Platform', ['Services', 'Spec sheet', 'Deployments', 'Integration']], ['Company', ['Mission', 'Careers', 'Press', 'Contact']], ['Operations', ['Request briefing', 'Operator login', 'Support', 'Disclosure']]];
  return /*#__PURE__*/React.createElement("footer", {
    className: "mk-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-container mk-footer-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-footer-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wm"
  }, "MTIVE"), /*#__PURE__*/React.createElement("p", null, "Autonomous systems for high-risk environments.")), cols.map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    className: "mk-footer-col",
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    className: "mk-eyebrow"
  }, h), /*#__PURE__*/React.createElement("ul", null, items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    className: "mk-container mk-footer-bar"
  }, /*#__PURE__*/React.createElement("span", null, "MTIVE Solutions \xB7 2026"), /*#__PURE__*/React.createElement("span", null, "mtive.tech")));
}
Object.assign(window, {
  Nav,
  Hero,
  Capabilities,
  Statement,
  SpecBlock,
  CtaBand,
  Footer
});

})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/components.jsx", error: String((e && e.message) || e) }); }

})();
