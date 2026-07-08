/* Interactive operational-architecture "system map" for the Doorvest case study.
   Rendered inside a sandboxed iframe (see EmbedFrame) so its global CSS reset and
   scripts stay isolated from the page. The two connector-drawing lines use plain
   string concatenation (not template literals) so this outer template needs no
   escaping. A trailing script posts the content height to the parent for sizing. */
export const doorvestSystemMapHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Operational architecture</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #1A1A1A;
    --ink-soft: #4A4A4A;
    --ink-muted: #8A8A8A;
    --line: #D8D8D8;
    --line-soft: #EBEBEB;
    --card: #FFFFFF;
    --card-edge: #E5E5E5;
    --accent: #4CA666;
    --accent-deep: #2F7A48;
    --accent-soft: #EAF5EE;
    --blue: #2563EB;
    --display: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
    --sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: transparent;
    color: var(--ink);
    font-family: var(--sans);
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    width: 100%;
  }

  .embed {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .canvas-wrap {
    width: 100%;
    max-width: 900px;
    height: 600px;
    background: var(--card);
    border: 1px solid var(--card-edge);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .canvas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--line-soft);
    background: var(--card);
    flex-shrink: 0;
    z-index: 10;
  }

  .canvas-title {
    font-family: var(--display);
    font-size: 11px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.3px;
  }

  .canvas-hint {
    font-size: 10px;
    color: var(--ink-muted);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.2px;
  }

  .canvas-hint .arrows {
    color: var(--accent);
    font-weight: 700;
    font-size: 12px;
  }

  .canvas-scroll-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .canvas-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
    background:
      radial-gradient(circle, #E8E8E8 1px, transparent 1px) 0 0 / 22px 22px,
      #FAFAFA;
    scroll-behavior: smooth;
  }

  .canvas-scroll-wrap::before,
  .canvas-scroll-wrap::after,
  .fade-top,
  .fade-bottom {
    content: "";
    position: absolute;
    pointer-events: none;
    z-index: 5;
    transition: opacity 0.2s ease;
  }

  .canvas-scroll-wrap::before {
    top: 0; bottom: 0; left: 0;
    width: 32px;
    background: linear-gradient(to right, rgba(250,250,250,0.95), transparent);
    opacity: 0;
  }

  .canvas-scroll-wrap::after {
    top: 0; bottom: 0; right: 0;
    width: 32px;
    background: linear-gradient(to left, rgba(250,250,250,0.95), transparent);
  }

  .fade-top {
    top: 0; left: 0; right: 0;
    height: 24px;
    background: linear-gradient(to bottom, rgba(250,250,250,0.95), transparent);
    opacity: 0;
  }

  .fade-bottom {
    bottom: 0; left: 0; right: 0;
    height: 24px;
    background: linear-gradient(to top, rgba(250,250,250,0.95), transparent);
  }

  .canvas-scroll-wrap.scrolled-x::before { opacity: 1; }
  .canvas-scroll-wrap.at-right::after { opacity: 0; }
  .canvas-scroll-wrap.scrolled-y .fade-top { opacity: 1; }
  .canvas-scroll-wrap.at-bottom .fade-bottom { opacity: 0; }

  .canvas-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
  .canvas-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
  .canvas-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
  .canvas-scroll::-webkit-scrollbar-thumb:hover { background: var(--ink-muted); }
  .canvas-scroll::-webkit-scrollbar-corner { background: transparent; }

  .canvas-sizer {
    position: relative;
    width: 1600px;
    height: 900px;
  }

  .canvas {
    width: 1600px;
    height: 900px;
    position: relative;
    transform-origin: 0 0;
    will-change: transform;
  }

  svg.connectors {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .node {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--card-edge);
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.22,.61,.36,1);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    z-index: 2;
    font-family: var(--display);
  }

  .node:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(76, 166, 102, 0.15), 0 2px 4px rgba(0,0,0,0.04);
    transform: translateY(-1px);
  }

  .node.is-active {
    border-color: var(--accent);
    border-width: 2px;
    padding: 9px 13px;
    background: #FFFFFF;
    box-shadow: 0 4px 16px rgba(76, 166, 102, 0.22), 0 2px 4px rgba(0,0,0,0.04);
  }

  .node-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
  }

  .node-dot.blue { background: var(--blue); }
  .node-dot.muted { background: var(--ink-muted); }

  .node-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.1px;
  }

  .node-sub {
    font-size: 10px;
    font-weight: 500;
    color: var(--ink-muted);
    margin-left: 4px;
    font-family: var(--sans);
  }

  .node.core {
    background: var(--card);
    border: 2px solid var(--accent);
    padding: 14px 22px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(76, 166, 102, 0.18), 0 2px 6px rgba(0,0,0,0.04);
  }

  .node.core .node-title {
    font-size: 15px;
    font-weight: 800;
    font-style: italic;
    letter-spacing: -0.3px;
  }

  .node.core .node-plus {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: var(--sans);
    margin-left: 6px;
  }

  .badge {
    position: absolute;
    background: var(--ink);
    color: white;
    border-radius: 999px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 700;
    z-index: 1;
    letter-spacing: 0.5px;
    line-height: 1;
  }

  .node-tool {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 6px;
    padding: 2px 6px;
    background: #F3F3F3;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 600;
    color: var(--ink-soft);
    font-family: var(--sans);
  }

  .node-tool-logo {
    width: 9px;
    height: 9px;
    display: inline-flex;
  }

  .node-tool-logo svg { width: 100%; height: 100%; }

  .connectors path {
    fill: none;
    stroke: var(--line);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
    transition: stroke 0.25s ease, opacity 0.25s ease, stroke-width 0.25s ease;
  }

  .connectors path.is-active {
    stroke: var(--accent);
    stroke-width: 2;
    stroke-dasharray: none;
    opacity: 1;
  }

  .canvas.dim-others .node:not(.is-active) { opacity: 0.4; }
  .canvas.dim-others .connectors path:not(.is-active) { opacity: 0.15; }

  .scroll-indicator {
    position: absolute;
    bottom: 12px;
    right: 12px;
    padding: 6px 10px;
    background: rgba(26, 26, 26, 0.85);
    color: white;
    font-size: 10px;
    font-weight: 600;
    border-radius: 999px;
    font-family: var(--display);
    letter-spacing: 0.3px;
    z-index: 6;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 6px;
    backdrop-filter: blur(4px);
    transition: opacity 0.3s ease;
  }

  .scroll-indicator.hidden { opacity: 0; }

  .scroll-indicator-arrows {
    display: inline-flex;
    gap: 2px;
    font-size: 11px;
  }

  .zoom-controls {
    position: absolute;
    left: 12px;
    bottom: 12px;
    z-index: 6;
    display: flex;
    gap: 6px;
  }

  .zoom-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--card-edge);
    background: var(--card);
    color: var(--ink);
    font-size: 17px;
    font-weight: 700;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    font-family: var(--sans);
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .zoom-btn:hover { border-color: var(--accent); background: #FAFAFA; }
  .zoom-btn:active { transform: translateY(1px); }

  .detail-panel {
    background: var(--card);
    border: 1px solid var(--card-edge);
    border-radius: 12px;
    padding: 20px 22px;
    min-height: 180px;
    max-width: 900px;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--line-soft);
  }

  .detail-eyebrow {
    font-family: var(--display);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent-deep);
    margin-bottom: 5px;
  }

  .detail-title {
    font-family: var(--display);
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.4px;
    line-height: 1.15;
    color: var(--ink);
  }

  .detail-tool-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 11px;
    background: #F3F3F3;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
  }

  .detail-tool-badge .logo-mark { width: 14px; height: 14px; }
  .detail-tool-badge .logo-mark svg { width: 100%; height: 100%; }

  .detail-desc {
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink);
    margin-bottom: 14px;
  }

  .detail-facets-label {
    font-family: var(--display);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 7px;
  }

  .detail-facets { display: flex; flex-wrap: wrap; gap: 5px; }

  .facet {
    font-size: 10.5px;
    font-weight: 500;
    padding: 3px 10px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    background: #FAFAFA;
  }
</style>
</head>
<body>

<div class="embed">

  <div class="canvas-wrap">
    <div class="canvas-header">
      <div class="canvas-title">System map</div>
      <div class="canvas-hint">
        <span class="arrows">&#8596; &#8597;</span>
        Scroll to explore
      </div>
    </div>

    <div class="canvas-scroll-wrap" id="scroll-wrap">
      <div class="fade-top"></div>
      <div class="fade-bottom"></div>

      <div class="canvas-scroll" id="scroll">
        <div class="canvas-sizer" id="canvas-sizer">
        <div class="canvas" id="canvas">

          <svg class="connectors" viewBox="0 0 1600 900" preserveAspectRatio="none" id="connectors"></svg>

          <div class="node" data-id="acquisition" style="left: 30px; top: 100px;">
            <span class="node-dot blue"></span>
            <span class="node-title">Acquisition team</span>
            <span class="node-tool">
              <span class="node-tool-logo" data-logo="asana"></span>Asana
            </span>
          </div>

          <div class="node" data-id="comps" style="left: 50px; top: 180px;">
            <span class="node-dot"></span>
            <span class="node-title">Home comps</span>
          </div>

          <div class="node" data-id="sales" style="left: 30px; top: 330px;">
            <span class="node-dot"></span>
            <span class="node-title">Sales coord.</span>
          </div>

          <div class="node" data-id="education" style="left: 50px; top: 410px;">
            <span class="node-dot blue"></span>
            <span class="node-title">Investor education</span>
          </div>

          <div class="node" data-id="support" style="left: 30px; top: 580px;">
            <span class="node-dot"></span>
            <span class="node-title">Support ops</span>
            <span class="node-tool">
              <span class="node-tool-logo" data-logo="linear"></span>Linear
            </span>
          </div>

          <div class="node" data-id="admin" style="left: 60px; top: 680px;">
            <span class="node-dot muted"></span>
            <span class="node-title">Admin tools</span>
            <span class="node-tool">
              <span class="node-tool-logo" data-logo="linear"></span>Linear
            </span>
          </div>

          <div class="node" data-id="discovery" style="left: 320px; top: 140px;">
            <span class="node-dot"></span>
            <span class="node-title">Marketplace</span>
            <span class="node-sub">Discovery</span>
          </div>

          <div class="node" data-id="onboarding" style="left: 340px; top: 370px;">
            <span class="node-dot blue"></span>
            <span class="node-title">Investor onboarding</span>
          </div>

          <div class="node" data-id="dashboard" style="left: 320px; top: 620px;">
            <span class="node-dot"></span>
            <span class="node-title">Portfolio dashboard</span>
          </div>

          <div class="badge" style="left: 400px; top: 490px;">&#183;&#183;&#183;</div>

          <div class="node" data-id="reservation" style="left: 620px; top: 250px;">
            <span class="node-dot"></span>
            <span class="node-title">Reservation system</span>
          </div>

          <div class="node" data-id="underwriting" style="left: 640px; top: 360px;">
            <span class="node-dot"></span>
            <span class="node-title">Underwriting</span>
          </div>

          <div class="node" data-id="property-mgmt" style="left: 620px; top: 510px;">
            <span class="node-dot"></span>
            <span class="node-title">Property management</span>
          </div>

          <div class="badge" style="left: 690px; top: 440px;">&#183;&#183;&#183;</div>

          <div class="node core" data-id="core" style="left: 900px; top: 390px;">
            <span class="node-title">Investor Platform</span>
            <span class="node-plus">+</span>
          </div>

          <div class="node" data-id="substrate" style="left: 880px; top: 80px;">
            <span class="node-dot muted"></span>
            <span class="node-title">Shared data substrate</span>
          </div>

          <div class="node" data-id="renovation" style="left: 1180px; top: 210px;">
            <span class="node-dot"></span>
            <span class="node-title">Renovation tracking</span>
          </div>

          <div class="node" data-id="projections" style="left: 1200px; top: 290px;">
            <span class="node-dot blue"></span>
            <span class="node-title">Financial projections</span>
          </div>

          <div class="node" data-id="mortgage" style="left: 1180px; top: 370px;">
            <span class="node-dot"></span>
            <span class="node-title">Mortgage coord.</span>
          </div>

          <div class="node" data-id="operator" style="left: 1200px; top: 450px;">
            <span class="node-dot"></span>
            <span class="node-title">Operator comms</span>
          </div>

          <div class="node" data-id="workorders" style="left: 1180px; top: 530px;">
            <span class="node-dot"></span>
            <span class="node-title">Work orders</span>
          </div>

          <div class="node" data-id="tenant" style="left: 1200px; top: 610px;">
            <span class="node-dot blue"></span>
            <span class="node-title">Tenant placement</span>
          </div>

          <div class="node" data-id="recommendation" style="left: 1410px; top: 250px;">
            <span class="node-dot"></span>
            <span class="node-title">Recommendation</span>
          </div>

          <div class="node" data-id="behavioral" style="left: 1430px; top: 340px;">
            <span class="node-dot"></span>
            <span class="node-title">Behavioral signals</span>
          </div>

          <div class="node" data-id="crm" style="left: 1410px; top: 480px;">
            <span class="node-dot"></span>
            <span class="node-title">CRM</span>
            <span class="node-tool">
              <span class="node-tool-logo" data-logo="hubspot"></span>HubSpot
            </span>
          </div>

          <div class="node" data-id="email" style="left: 1430px; top: 570px;">
            <span class="node-dot"></span>
            <span class="node-title">Email systems</span>
          </div>

        </div>
        </div>
      </div>

      <div class="zoom-controls">
        <button class="zoom-btn" id="zoom-out" type="button" aria-label="Zoom out">&#8722;</button>
        <button class="zoom-btn" id="zoom-in" type="button" aria-label="Zoom in">+</button>
      </div>

      <div class="scroll-indicator" id="scroll-indicator">
        <span class="scroll-indicator-arrows">&#8596; &#8597;</span>
        <span>Drag or scroll</span>
      </div>
    </div>
  </div>

  <div class="detail-panel" id="panel">
    <div class="detail-header">
      <div>
        <div class="detail-eyebrow" id="panel-eyebrow">Begin anywhere</div>
        <div class="detail-title" id="panel-title">The connected operating system</div>
      </div>
      <div class="detail-tool-badge" id="panel-tool" style="display:none">
        <span class="logo-mark" id="panel-tool-logo"></span>
        <span id="panel-tool-name"></span>
      </div>
    </div>
    <p class="detail-desc" id="panel-desc">
      Tap or hover any node to see what each system did and how it connected.
    </p>
    <div class="detail-facets-label" id="panel-facets-label" style="display:none">Operational facets</div>
    <div class="detail-facets" id="panel-facets"></div>
  </div>

</div>

<script>
  const connectorPairs = [
    ["substrate", "core", "b", "t"],
    ["discovery", "reservation", "r", "l"],
    ["discovery", "underwriting", "r", "l"],
    ["onboarding", "underwriting", "r", "l"],
    ["dashboard", "property-mgmt", "r", "l"],
    ["reservation", "core", "r", "l"],
    ["underwriting", "core", "r", "l"],
    ["property-mgmt", "core", "r", "l"],
    ["acquisition", "discovery", "r", "l"],
    ["comps", "discovery", "r", "l"],
    ["sales", "onboarding", "r", "l"],
    ["education", "onboarding", "r", "l"],
    ["support", "dashboard", "r", "l"],
    ["admin", "dashboard", "r", "l"],
    ["core", "renovation", "r", "l"],
    ["core", "projections", "r", "l"],
    ["core", "mortgage", "r", "l"],
    ["core", "operator", "r", "l"],
    ["core", "workorders", "r", "l"],
    ["core", "tenant", "r", "l"],
    ["recommendation", "core", "l", "r"],
    ["behavioral", "core", "l", "r"],
    ["crm", "core", "l", "r"],
    ["email", "core", "l", "r"]
  ];

  let zoom = 1;

  function getAnchor(el, side) {
    const rect = el.getBoundingClientRect();
    const parent = document.getElementById("canvas").getBoundingClientRect();
    const x = (rect.left - parent.left) / zoom;
    const y = (rect.top - parent.top) / zoom;
    const w = rect.width / zoom;
    const h = rect.height / zoom;
    switch (side) {
      case "l": return [x, y + h / 2];
      case "r": return [x + w, y + h / 2];
      case "t": return [x + w / 2, y];
      case "b": return [x + w / 2, y + h];
    }
  }

  function curvedPath(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const cx1 = x1 + dx * 0.5;
    const cy1 = y1;
    const cx2 = x2 - dx * 0.5;
    const cy2 = y2;
    return "M " + x1 + " " + y1 + " C " + cx1 + " " + cy1 + ", " + cx2 + " " + cy2 + ", " + x2 + " " + y2;
  }

  function drawConnectors() {
    const svg = document.getElementById("connectors");
    svg.innerHTML = "";
    connectorPairs.forEach(function (pair) {
      const from = pair[0], to = pair[1], fromSide = pair[2], toSide = pair[3];
      const fromEl = document.querySelector('[data-id="' + from + '"]');
      const toEl = document.querySelector('[data-id="' + to + '"]');
      if (!fromEl || !toEl) return;
      const a = getAnchor(fromEl, fromSide);
      const b = getAnchor(toEl, toSide);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", curvedPath(a[0], a[1], b[0], b[1]));
      path.setAttribute("data-from", from);
      path.setAttribute("data-to", to);
      svg.appendChild(path);
    });
  }

  const nodes = {
    core: { eyebrow: "Core platform", title: "Investor platform", desc: "The single surface where every operational workflow met the investor. Marketplace, dashboard, account, and notifications consolidated into one persistent investment operating system — a shift from fragmented one-time transactions toward managing long-term ownership relationships.", facets: ["Marketplace", "Dashboard", "Account", "Notifications"] },
    substrate: { eyebrow: "Shared data substrate", title: "Documents, taxes, verified property info", desc: "Persistent assets every system read from and wrote to: signed documents, tax paperwork, verified property indicators, and uploaded files. Replaced the earlier reliance on email attachments and disconnected channels.", facets: ["Documents", "Tax docs", "Verified indicators", "Uploads"] },
    discovery: { eyebrow: "Marketplace", title: "Marketplace discovery", desc: "Evolved from a listing surface into a behavioral recommendation system. Introduced saved homes, comparison tools, like/dislike interactions, personalized recommendations, and filtering by cash flow, equity, appreciation, and strategy — replacing the pressure of timed email drops with a calmer, browsable inventory.", facets: ["Listings", "Saved homes", "Compare", "Filters", "Personalization"] },
    underwriting: { eyebrow: "Acquisition", title: "Underwriting", desc: "Where each property was modeled against assumptions, comps, and projections before reaching the marketplace. Coordinated with the acquisition team and surfaced verified metrics for investor-facing transparency.", facets: ["Risk models", "Comps", "Approvals", "Verified metrics"] },
    acquisition: { eyebrow: "Sourcing", title: "Acquisition team", desc: "Internal team responsible for sourcing properties. Their pipeline coordination ran across multiple tools and required manual synchronization with underwriting, renovation, and marketplace inventory before the platform unified those handoffs.", facets: ["Sourcing", "Offers", "Pipeline", "Markets"], tool: "asana" },
    comps: { eyebrow: "Market data", title: "Home comps", desc: "Comparable sales and rental data feeding valuations across discovery, underwriting, and reservation. Available to experienced investors who downloaded them directly when evaluating homes.", facets: ["Comps", "Rental data", "Neighborhoods", "Income data"] },
    projections: { eyebrow: "Modeling", title: "Financial projections", desc: "Forecasted cash flow, appreciation, equity buildup, and long-term returns. One of the most sensitive surfaces — too much detail increased anxiety for new investors, too little weakened trust for experienced ones.", facets: ["Cash flow", "Appreciation", "Equity", "Scenarios"] },
    mortgage: { eyebrow: "Financing", title: "Mortgage coordination", desc: "Bridged investors with lenders. Loan products, rate locks, document collection, and closing logistics — coordinated through the platform rather than scattered across channels.", facets: ["Lenders", "Docs", "Closing"] },
    onboarding: { eyebrow: "Entry", title: "Investor onboarding", desc: "The handshake moment that turned a curious visitor into a known investor. Adapted to investor maturity: new investors received reassurance and education; experienced investors moved quickly into financial detail. Replaced the original signup form that pushed users into email cohorts.", facets: ["Signup", "Suitability", "Education", "Preferences"] },
    reservation: { eyebrow: "Commit", title: "Reservation system", desc: "Replaced timed email drops and fast-moving reservations with a calmer, browsable reservation flow. Removed the pressure that compounded uncertainty during major financial decisions.", facets: ["Holds", "Commitments", "Escrow"] },
    dashboard: { eyebrow: "View", title: "Portfolio dashboard", desc: "Centralized portfolio management, property states, renovation tracking, work orders, lease visibility, tax documents, support communication, and additional investment opportunities. Shifted Doorvest from a transactional platform into a persistent investment operating system.", facets: ["Portfolio", "Property states", "Renovation", "Work orders", "Lease", "Tax docs"] },
    "property-mgmt": { eyebrow: "Operate", title: "Property management", desc: "The longest-running surface — day-to-day operations after close: rent collection, tenant relations, vendor coordination, and ongoing maintenance. The platform layer that turned a one-time purchase into a multi-year relationship.", facets: ["Rent collection", "Tenants", "Vendors", "Inspections"] },
    renovation: { eyebrow: "Construction", title: "Renovation tracking", desc: "Made renovation scope, budget, and schedule visible to investors who would never physically visit the home. A core trust-infrastructure surface — reducing ambiguity by showing work as it moved from estimate to complete.", facets: ["Scope", "Budget", "Schedule", "Visibility"] },
    workorders: { eyebrow: "Maintenance", title: "Work orders", desc: "Repair requests from tenants, dispatched to vendors, surfaced to investors. Each one a small operational loop in service of transparency — visible alongside the rest of the portfolio.", facets: ["Tickets", "Vendors", "Billing", "Status"] },
    tenant: { eyebrow: "Leasing", title: "Tenant placement", desc: "Marketing the home, screening applicants, signing leases. Time-to-lease links acquisition economics to long-term portfolio reality — a metric the entire platform optimized around.", facets: ["Marketing", "Screening", "Leases"] },
    operator: { eyebrow: "Field", title: "Operator communication", desc: "Property-level updates from contractors, property managers, and inspectors. The channel that turned ground truth into structured platform data — replacing earlier disconnected direct-to-investor communication.", facets: ["Updates", "Photos", "Field notes"] },
    sales: { eyebrow: "Coordination", title: "Sales coordination", desc: "Investor-facing humans who picked up where automation thinned out. The platform shortened the path to representative engagement and reduced support dependency — but the human layer remained essential for high-stakes decisions.", facets: ["Pipeline", "Handoffs", "Calls"] },
    support: { eyebrow: "Service", title: "Support operations", desc: "Investor relations tied directly to portfolio context — every conversation could reference the investor's properties, documents, and active workflows rather than starting cold.", facets: ["Tickets", "Concierge", "Escalations"], tool: "linear" },
    education: { eyebrow: "Confidence", title: "Investor education", desc: "Cap rate, appreciation, equity, reserve costs — the financial literacy layer that helped first-time investors understand what they were looking at. Built into the marketplace rather than separated into a learning silo.", facets: ["Cap rate", "Appreciation", "Reserves", "Strategy"] },
    admin: { eyebrow: "Operations", title: "Internal admin tools", desc: "The mirror view operators used to override, configure, and audit the platform. Every consumer-facing surface had a corresponding admin surface for the team running operations behind it.", facets: ["Overrides", "Config", "Audit"], tool: "linear" },
    recommendation: { eyebrow: "Personalization", title: "Recommendation engine", desc: "Read behavioral signals — saves, compares, likes, dislikes, dwell — to surface the next-best property per investor. Investor interactions became signals that informed ranking, marketplace personalization, acquisition priorities, and inventory direction.", facets: ["Models", "Ranking", "Inventory direction"] },
    behavioral: { eyebrow: "Analytics", title: "Behavioral signals", desc: "Captured how investors actually used the marketplace — which often diverged from what they reported in interviews. Required balancing qualitative and quantitative signals when iterating on product decisions.", facets: ["Events", "Cohorts", "Patterns"] },
    crm: { eyebrow: "Relationship", title: "HubSpot CRM", desc: "System of record for every relationship — investor, lender, vendor, agent. Originally one of several disconnected tools internal teams manually synchronized. Connected into the platform so context was preserved across handoffs.", facets: ["Contacts", "Deals", "Sync"], tool: "hubspot" },
    email: { eyebrow: "Communication", title: "Email systems", desc: "Transactional and lifecycle messages. The original marketplace relied on email drops to release inventory — the redesigned platform demoted email from primary surface to one of many supporting channels.", facets: ["Transactional", "Lifecycle", "Notifications"] }
  };

  const logos = {
    hubspot: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M23 11.7V8.9a2.1 2.1 0 0 0 1.2-1.9 2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 1.2 1.9v2.8a6 6 0 0 0-2.8 1.2L11 7.2a2.4 2.4 0 1 0-1.1 1.4l7.3 5.7a6 6 0 0 0 .1 6.8l-2.2 2.2a1.9 1.9 0 0 0-.6-.1 2 2 0 1 0 2 2 1.9 1.9 0 0 0-.1-.6l2.2-2.2a6 6 0 1 0 4.4-10.6Zm-1 9.2a3.1 3.1 0 1 1 3.1-3.1 3.1 3.1 0 0 1-3.1 3.1Z" fill="#FE4802"/></svg>',
    asana: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="9" r="5" fill="#F06A6A"/><circle cx="9" cy="21" r="5" fill="#F06A6A"/><circle cx="23" cy="21" r="5" fill="#F06A6A"/></svg>',
    linear: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M2 18.5L13.5 30A14 14 0 0 1 2 18.5ZM2 13.7L18.3 30a14 14 0 0 1-3.6-.9L2.9 17.3A14 14 0 0 1 2 13.7Zm.7-3.7L22 29.3a14 14 0 0 1-2.6-1.7L4.4 12.6A14 14 0 0 1 2.7 10Zm2.4-3.3a14 14 0 1 1 19.8 19.8L5.1 6.7Z" fill="#5E6AD2"/></svg>'
  };

  const tools = {
    hubspot: { name: "HubSpot", logo: "hubspot" },
    asana: { name: "Asana", logo: "asana" },
    linear: { name: "Linear", logo: "linear" }
  };

  const connections = {
    core: ["substrate", "discovery", "onboarding", "reservation", "dashboard", "underwriting", "property-mgmt", "renovation", "projections", "mortgage", "operator", "workorders", "tenant", "recommendation", "behavioral", "crm", "email"],
    substrate: ["core"],
    discovery: ["acquisition", "comps", "reservation", "underwriting"],
    underwriting: ["core", "discovery", "onboarding"],
    acquisition: ["discovery"],
    comps: ["discovery"],
    projections: ["core"],
    mortgage: ["core"],
    onboarding: ["sales", "education", "underwriting"],
    reservation: ["core", "discovery"],
    dashboard: ["support", "admin", "property-mgmt"],
    "property-mgmt": ["core", "dashboard"],
    renovation: ["core"],
    operator: ["core"],
    workorders: ["core"],
    tenant: ["core"],
    sales: ["onboarding"],
    education: ["onboarding"],
    support: ["dashboard"],
    admin: ["dashboard"],
    recommendation: ["core"],
    behavioral: ["core"],
    crm: ["core"],
    email: ["core"]
  };

  const canvas = document.getElementById("canvas");
  const scrollEl = document.getElementById("scroll");
  const scrollWrap = document.getElementById("scroll-wrap");
  const indicator = document.getElementById("scroll-indicator");
  const sizer = document.getElementById("canvas-sizer");

  function applyZoom() {
    sizer.style.width = (1600 * zoom) + "px";
    sizer.style.height = (900 * zoom) + "px";
    canvas.style.transform = "scale(" + zoom + ")";
    drawConnectors();
  }

  function setZoom(nz) {
    nz = Math.max(0.5, Math.min(1.6, Math.round(nz * 100) / 100));
    if (nz === zoom) return;
    const vw = scrollEl.clientWidth, vh = scrollEl.clientHeight;
    const cx = (scrollEl.scrollLeft + vw / 2) / zoom;
    const cy = (scrollEl.scrollTop + vh / 2) / zoom;
    zoom = nz;
    applyZoom();
    scrollEl.scrollLeft = cx * zoom - vw / 2;
    scrollEl.scrollTop = cy * zoom - vh / 2;
    updateScrollState();
  }

  document.getElementById("zoom-in").addEventListener("click", function () { setZoom(zoom + 0.15); });
  document.getElementById("zoom-out").addEventListener("click", function () { setZoom(zoom - 0.15); });

  const panel = {
    eyebrow: document.getElementById("panel-eyebrow"),
    title: document.getElementById("panel-title"),
    desc: document.getElementById("panel-desc"),
    facets: document.getElementById("panel-facets"),
    facetsLabel: document.getElementById("panel-facets-label"),
    tool: document.getElementById("panel-tool"),
    toolLogo: document.getElementById("panel-tool-logo"),
    toolName: document.getElementById("panel-tool-name")
  };

  function highlight(id) {
    const related = connections[id] || [];
    document.querySelectorAll(".connectors path").forEach(function (p) {
      const from = p.getAttribute("data-from");
      const to = p.getAttribute("data-to");
      if (from === id || to === id) p.classList.add("is-active");
      else p.classList.remove("is-active");
    });
    document.querySelectorAll(".node").forEach(function (n) {
      const nid = n.getAttribute("data-id");
      if (nid === id || related.indexOf(nid) !== -1) n.classList.add("is-active");
      else n.classList.remove("is-active");
    });
    canvas.classList.add("dim-others");
  }

  function clearHighlight() {
    document.querySelectorAll(".connectors path").forEach(function (p) { p.classList.remove("is-active"); });
    document.querySelectorAll(".node").forEach(function (n) { n.classList.remove("is-active"); });
    canvas.classList.remove("dim-others");
  }

  function showNode(id) {
    const n = nodes[id];
    if (!n) return;
    panel.eyebrow.textContent = n.eyebrow;
    panel.title.textContent = n.title;
    panel.desc.textContent = n.desc;
    panel.facets.innerHTML = "";
    if (n.facets && n.facets.length) {
      panel.facetsLabel.style.display = "block";
      n.facets.forEach(function (f) {
        const el = document.createElement("span");
        el.className = "facet";
        el.textContent = f;
        panel.facets.appendChild(el);
      });
    } else {
      panel.facetsLabel.style.display = "none";
    }
    if (n.tool && tools[n.tool]) {
      const t = tools[n.tool];
      panel.tool.style.display = "flex";
      panel.toolLogo.innerHTML = logos[t.logo] || "";
      panel.toolName.textContent = t.name;
    } else {
      panel.tool.style.display = "none";
    }
  }

  document.querySelectorAll("[data-logo]").forEach(function (el) {
    const key = el.getAttribute("data-logo");
    if (logos[key]) el.innerHTML = logos[key];
  });

  document.querySelectorAll(".node").forEach(function (node) {
    const id = node.getAttribute("data-id");
    if (!id) return;
    node.addEventListener("mouseenter", function () { showNode(id); highlight(id); });
    node.addEventListener("click", function (e) { e.stopPropagation(); showNode(id); highlight(id); });
    node.addEventListener("focus", function () { showNode(id); highlight(id); });
    node.setAttribute("tabindex", "0");
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".node")) clearHighlight();
  });

  function updateScrollState() {
    const maxX = scrollEl.scrollWidth - scrollEl.clientWidth;
    const maxY = scrollEl.scrollHeight - scrollEl.clientHeight;
    scrollWrap.classList.toggle("scrolled-x", scrollEl.scrollLeft > 4);
    scrollWrap.classList.toggle("at-right", scrollEl.scrollLeft >= maxX - 4);
    scrollWrap.classList.toggle("scrolled-y", scrollEl.scrollTop > 4);
    scrollWrap.classList.toggle("at-bottom", scrollEl.scrollTop >= maxY - 4);
  }

  scrollEl.addEventListener("scroll", function () {
    updateScrollState();
    if (scrollEl.scrollLeft > 20 || scrollEl.scrollTop > 20) {
      indicator.classList.add("hidden");
    }
  });

  function init() {
    applyZoom();
    showNode("core");

    const core = document.querySelector('[data-id="core"]');
    if (core) {
      const coreRect = core.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const coreX = coreRect.left - canvasRect.left;
      const coreY = coreRect.top - canvasRect.top;
      scrollEl.scrollLeft = coreX - scrollEl.clientWidth / 2 + 80;
      scrollEl.scrollTop = coreY - scrollEl.clientHeight / 2 + 40;
    }

    updateScrollState();
    setTimeout(function () { indicator.classList.add("hidden"); }, 4000);
  }

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      drawConnectors();
      updateScrollState();
    }, 150);
  });
</script>

<script>
  (function () {
    function post() {
      var e = document.querySelector('.embed');
      var h = e ? e.getBoundingClientRect().height : document.body.scrollHeight;
      parent.postMessage({ type: 'cs-embed-height', height: Math.ceil(h) + 4 }, '*');
    }
    window.addEventListener('load', function () { post(); setTimeout(post, 400); });
    if (window.ResizeObserver) { new ResizeObserver(post).observe(document.body); }
  })();
</script>

</body>
</html>`;
