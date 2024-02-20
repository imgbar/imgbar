(function (c, S) {
  typeof exports == "object" && typeof module < "u"
    ? S(exports)
    : typeof define == "function" && define.amd
      ? define(["exports"], S)
      : ((c = typeof globalThis < "u" ? globalThis : c || self),
        S((c.canvasTxt = {})));
})(this, function (c) {
  "use strict";
  function S({ ctx: e, line: b, spaceWidth: d, spaceChar: n, width: a }) {
    const i = b.trim(),
      o = i.split(/\s+/),
      s = o.length - 1;
    if (s === 0) return i;
    const m = e.measureText(o.join("")).width,
      p = (a - m) / d,
      T = Math.floor(p / s);
    if (p < 1) return i;
    const r = n.repeat(T);
    return o.join(r);
  }
  const P = " ";
  function H({ ctx: e, text: b, justify: d, width: n }) {
    const a = new Map(),
      i = (r) => {
        let g = a.get(r);
        return g !== void 0 || ((g = e.measureText(r).width), a.set(r, g)), g;
      };
    let o = [],
      s = b.split(`
`);
    const m = d ? i(P) : 0;
    let p = 0,
      T = 0;
    for (const r of s) {
      let g = i(r);
      const A = r.length;
      if (g <= n) {
        o.push(r);
        continue;
      }
      let u = r,
        t,
        f,
        l = "";
      for (; g > n; ) {
        if ((p++, (t = T), (f = t === 0 ? 0 : i(r.substring(0, t))), f < n))
          for (
            ;
            f < n && t < A && (t++, (f = i(u.substring(0, t))), t !== A);

          );
        else if (f > n)
          for (
            ;
            f > n &&
            ((t = Math.max(1, t - 1)),
            (f = i(u.substring(0, t))),
            !(t === 0 || t === 1));

          );
        if (((T = Math.round(T + (t - T) / p)), t--, t > 0)) {
          let h = t;
          if (u.substring(h, h + 1) != " ") {
            for (; u.substring(h, h + 1) != " " && h >= 0; ) h--;
            h > 0 && (t = h);
          }
        }
        t === 0 && (t = 1),
          (l = u.substring(0, t)),
          (l = d
            ? S({ ctx: e, line: l, spaceWidth: m, spaceChar: P, width: n })
            : l),
          o.push(l),
          (u = u.substring(t)),
          (g = i(u));
      }
      g > 0 &&
        ((l = d
          ? S({ ctx: e, line: u, spaceWidth: m, spaceChar: P, width: n })
          : u),
        o.push(l));
    }
    return o;
  }
  function k({ ctx: e, text: b, style: d }) {
    const n = e.textBaseline,
      a = e.font;
    (e.textBaseline = "bottom"), (e.font = d);
    const { actualBoundingBoxAscent: i } = e.measureText(b);
    return (e.textBaseline = n), (e.font = a), i;
  }
  const M = {
    debug: !1,
    align: "center",
    vAlign: "middle",
    fontSize: 14,
    fontWeight: "",
    fontStyle: "",
    fontVariant: "",
    font: "Arial",
    lineHeight: null,
    justify: !1,
  };
  function j(e, b, d) {
    const { width: n, height: a, x: i, y: o } = d,
      s = { ...M, ...d };
    if (n <= 0 || a <= 0 || s.fontSize <= 0) return { height: 0 };
    const m = i + n,
      p = o + a,
      { fontStyle: T, fontVariant: r, fontWeight: g, fontSize: A, font: u } = s,
      t = `${T} ${r} ${g} ${A}px ${u}`;
    e.font = t;
    let f = o + a / 2 + s.fontSize / 2,
      l;
    s.align === "right"
      ? ((l = m), (e.textAlign = "right"))
      : s.align === "left"
        ? ((l = i), (e.textAlign = "left"))
        : ((l = i + n / 2), (e.textAlign = "center"));
    const h = H({ ctx: e, text: b, justify: s.justify, width: n }),
      W = s.lineHeight ? s.lineHeight : k({ ctx: e, text: "M", style: t }),
      B = W * (h.length - 1),
      x = B / 2;
    let v = o;
    if (
      (s.vAlign === "top"
        ? ((e.textBaseline = "top"), (f = o))
        : s.vAlign === "bottom"
          ? ((e.textBaseline = "bottom"), (f = p - B), (v = p))
          : ((e.textBaseline = "bottom"), (v = o + a / 2), (f -= x)),
      h.forEach((y) => {
        (y = y.trim()), e.fillText(y, l, f), (f += W);
      }),
      s.debug)
    ) {
      const y = "#0C8CE9";
      (e.lineWidth = 1),
        (e.strokeStyle = y),
        e.strokeRect(i, o, n, a),
        (e.lineWidth = 1),
        (e.strokeStyle = y),
        e.beginPath(),
        e.moveTo(l, o),
        e.lineTo(l, p),
        e.stroke(),
        (e.strokeStyle = y),
        e.beginPath(),
        e.moveTo(i, v),
        e.lineTo(m, v),
        e.stroke();
    }
    return { height: B + W };
  }
  (c.drawText = j),
    (c.getTextHeight = k),
    (c.splitText = H),
    Object.defineProperty(c, Symbol.toStringTag, { value: "Module" });
});
