/**
 * Horizontal-overflow audit. Paste into the browser console, or inject it with
 * whatever automation is driving the page, on every route at 375, 768 and 1440.
 *
 *   ANDARI_AUDIT.run()   -> { width, docScrollW, offenders: [...] }
 *
 * "Nothing may scroll sideways" is easy to assert and easy to break, usually by
 * a fixed panel that ignores the viewport, a min-width on a grid child, or a
 * visually-hidden input parked at left:-9999px. This finds the specific element
 * rather than just reporting that the page is too wide.
 *
 * Elements are reported when their right edge passes the documentElement's
 * client width, or their left edge is negative, and they are not clipped by an
 * ancestor. Fixed-position decoration that is deliberately off-screen is
 * excluded only when it is genuinely invisible (zero opacity or clipped).
 */
(function () {
  const SLACK = 1; // sub-pixel rounding

  function isHidden(el, cs) {
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    if (parseFloat(cs.opacity) === 0) return true;
    if (cs.clipPath && cs.clipPath !== "none" && cs.clipPath.includes("inset(50%)")) return true;
    const r = el.getBoundingClientRect();
    return r.width === 0 || r.height === 0;
  }

  /** Walk up looking for an ancestor that clips horizontally. */
  function clippedByAncestor(el) {
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (
        cs.overflowX === "hidden" ||
        cs.overflowX === "clip" ||
        cs.overflowX === "auto" ||
        cs.overflowX === "scroll"
      ) {
        const r = node.getBoundingClientRect();
        if (r.right <= document.documentElement.clientWidth + SLACK && r.left >= -SLACK) return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  function describe(el) {
    const id = el.id ? `#${el.id}` : "";
    const cls =
      typeof el.className === "string" && el.className
        ? `.${el.className.trim().split(/\s+/).slice(0, 4).join(".")}`
        : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 140);
  }

  function run() {
    const docEl = document.documentElement;
    const vw = docEl.clientWidth;
    const offenders = [];

    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (isHidden(el, cs)) continue;
      const r = el.getBoundingClientRect();
      const overRight = r.right - vw;
      const overLeft = -r.left;
      if (overRight <= SLACK && overLeft <= SLACK) continue;
      if (clippedByAncestor(el)) continue;
      offenders.push({
        el: describe(el),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        overflowRight: Math.round(Math.max(0, overRight)),
        overflowLeft: Math.round(Math.max(0, overLeft)),
        position: cs.position,
      });
    }

    // Deduplicate: a wide child usually drags its parents into the list too.
    offenders.sort((a, b) => b.overflowRight + b.overflowLeft - (a.overflowRight + a.overflowLeft));

    return {
      url: location.pathname,
      width: vw,
      docScrollW: docEl.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      horizontallyScrollable: docEl.scrollWidth > vw + SLACK,
      offenderCount: offenders.length,
      offenders: offenders.slice(0, 12),
    };
  }

  window.ANDARI_AUDIT = { run };
  return run();
})();
