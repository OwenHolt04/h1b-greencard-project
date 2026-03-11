import React from 'react';
import { interpolate, Easing } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

// ── Walkthrough Timing ──
export const WK_FPS = 30;

export const WK_SECONDS = {
  sharedRecord: 14,
  smartIntake: 18,
  validationQuick: 7,
  rolePerspectives: 60,
};

export const WK_FRAMES = Object.fromEntries(
  Object.entries(WK_SECONDS).map(([k, v]) => [k, v * WK_FPS])
);

export const WK_TR = {
  '1_2': 15,
  '2_3': 12,
  '3_4': 12,
};

const WK_GROSS = Object.values(WK_FRAMES).reduce((a, b) => a + b, 0);
const WK_OVERLAP = Object.values(WK_TR).reduce((a, b) => a + b, 0);
export const WK_TOTAL_FRAMES = WK_GROSS - WK_OVERLAP;

// ── Browser Frame Layout ──
export const BROWSER = {
  left: 48, top: 24,
  width: 1824, height: 1032,
  titleBar: 36, radius: 12,
};

export const CONTENT = {
  left: BROWSER.left,
  top: BROWSER.top + BROWSER.titleBar,
  width: BROWSER.width,
  height: BROWSER.height - BROWSER.titleBar,
};

export const NAV_H = 48;

// ── BrowserFrame ──
export const BrowserFrame = ({ children, url = 'app.casebridge.io' }) => (
  <div style={{
    position: 'absolute',
    left: BROWSER.left, top: BROWSER.top,
    width: BROWSER.width, height: BROWSER.height,
    borderRadius: BROWSER.radius,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
  }}>
    {/* Title bar */}
    <div style={{
      height: BROWSER.titleBar,
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 7,
    }}>
      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{ w: 11, height: 11, borderRadius: '50%', background: '#ff5f56', width: 11 }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <div style={{
        flex: 1, marginLeft: 60,
        height: 22, borderRadius: 5,
        background: '#ffffff', border: '1px solid #d4d4d4',
        display: 'flex', alignItems: 'center',
        padding: '0 10px',
        fontSize: 12, fontFamily: FONT_SANS,
        color: '#888',
      }}>
        <span style={{ marginRight: 6, fontSize: 10 }}>&#x1f512;</span>
        {url}
      </div>
    </div>
    {/* Content */}
    <div style={{
      position: 'relative',
      width: BROWSER.width,
      height: BROWSER.height - BROWSER.titleBar,
      overflow: 'hidden',
      background: '#ffffff',
    }}>
      {children}
    </div>
  </div>
);

// ── WebNavBar ──
const NAV_ITEMS = ['Overview', 'Dashboard', 'Intake', 'Roles', 'Impact'];

export const WebNavBar = ({ activeTab = 'Dashboard' }) => (
  <div style={{
    height: NAV_H,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center',
    padding: '0 24px',
    fontFamily: FONT_SANS,
  }}>
    <div style={{
      fontSize: 16, fontWeight: 700,
      color: C.navy900, marginRight: 32,
    }}>
      CaseBridge
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      {NAV_ITEMS.map(item => (
        <div key={item} style={{
          padding: '6px 14px', borderRadius: 6,
          fontSize: 13, fontWeight: 600,
          color: item === activeTab ? '#ffffff' : '#64748b',
          background: item === activeTab ? C.navy900 : 'transparent',
        }}>
          {item}
        </div>
      ))}
    </div>
  </div>
);

// ── AnimatedCursor ──
export const AnimatedCursor = ({ x, y, clicking = false, visible = true }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', left: x - 2, top: y - 2,
      zIndex: 1000, pointerEvents: 'none',
    }}>
      {clicking && (
        <div style={{
          position: 'absolute', left: -8, top: -8,
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid rgba(59,130,246,0.5)',
          background: 'rgba(59,130,246,0.1)',
        }} />
      )}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
        style={{
          transform: clicking ? 'scale(0.85)' : 'scale(1)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
        }}>
        <path d="M4 2L4 18L8.5 13.5L12.5 19L15 17.5L11 11.5L17 11.5L4 2Z"
          fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

// ── Cursor path interpolation ──
export const getCursorState = (frame, fps, waypoints) => {
  if (!waypoints || !waypoints.length) return { x: 960, y: 540, clicking: false, visible: false };

  const framed = waypoints.map(w => ({ ...w, f: Math.round(w.t * fps) }));

  let idx = framed.length - 1;
  for (let i = 0; i < framed.length - 1; i++) {
    if (frame < framed[i + 1].f) { idx = i; break; }
  }

  const prev = framed[idx];
  const next = framed[Math.min(idx + 1, framed.length - 1)];

  if (prev.f >= next.f) {
    return { x: prev.x, y: prev.y, clicking: false, visible: prev.visible !== false };
  }

  const t = interpolate(frame, [prev.f, next.f], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return {
    x: prev.x + (next.x - prev.x) * t,
    y: prev.y + (next.y - prev.y) * t,
    clicking: next.click && t > 0.85,
    visible: prev.visible !== false,
  };
};

// ── Camera state interpolation ──
export const getCameraState = (frame, fps, keyframes) => {
  const def = { zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 };
  if (!keyframes || !keyframes.length) return def;

  const framed = keyframes.map(k => ({ ...k, f: Math.round(k.t * fps) }));

  let idx = framed.length - 1;
  for (let i = 0; i < framed.length - 1; i++) {
    if (frame < framed[i + 1].f) { idx = i; break; }
  }

  const prev = framed[idx];
  const next = framed[Math.min(idx + 1, framed.length - 1)];

  if (prev.f >= next.f) {
    return { zoom: prev.zoom, focusX: prev.focusX, focusY: prev.focusY };
  }

  const t = interpolate(frame, [prev.f, next.f], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return {
    zoom: prev.zoom + (next.zoom - prev.zoom) * t,
    focusX: prev.focusX + (next.focusX - prev.focusX) * t,
    focusY: prev.focusY + (next.focusY - prev.focusY) * t,
  };
};

// ── Camera transform style ──
export const cameraStyle = (cam) => ({
  transform: `translate(${-cam.focusX * cam.zoom + CONTENT.width / 2}px, ${-cam.focusY * cam.zoom + CONTENT.height / 2}px) scale(${cam.zoom})`,
  transformOrigin: '0 0',
  width: CONTENT.width,
  height: CONTENT.height,
  position: 'absolute',
});

// ── Reusable website elements ──
export const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color: '#94a3b8',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 8, fontFamily: FONT_SANS,
  }}>
    {children}
  </div>
);

export const WebCard = ({ children, style = {}, highlight = false, glow = false }) => (
  <div style={{
    background: highlight ? 'rgba(22,39,104,0.03)' : '#ffffff',
    border: `1px solid ${highlight ? 'rgba(22,39,104,0.15)' : '#e2e8f0'}`,
    borderRadius: 10, padding: '14px 16px',
    fontFamily: FONT_SANS,
    boxShadow: glow ? '0 0 20px rgba(34,197,94,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
    ...style,
  }}>
    {children}
  </div>
);

export const MetricBadge = ({ before, after, label, change }) => (
  <WebCard>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 16, color: '#94a3b8', textDecoration: 'line-through' }}>{before}</span>
      <span style={{ fontSize: 12, color: '#cbd5e1' }}>{'\u2192'}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: C.navy900 }}>{after}</span>
    </div>
    {change && <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>{change}</div>}
  </WebCard>
);

// ── Presentation-matching card (FocalCard / SupportingModule equivalent) ──
export const PCard = ({ children, style = {}, focal = false }) => (
  <div style={{
    background: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    boxShadow: focal ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
    fontFamily: FONT_SANS,
    ...style,
  }}>
    {children}
  </div>
);

// ── Animated tile entrance (spring-based fade+slide) ──
export const tileEntrance = (frame, fps, delaySec) => {
  const delayF = Math.round(delaySec * fps);
  if (frame < delayF) return { opacity: 0, transform: 'translateY(10px)' };
  const t = Math.min((frame - delayF) / 12, 1);
  const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
  return {
    opacity: ease,
    transform: `translateY(${10 * (1 - ease)}px)`,
  };
};

// ── Role tab pill for SingleSource header ──
export const RoleTab = ({ label, active, icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', borderRadius: 8,
    fontSize: 12, fontWeight: 600, fontFamily: FONT_SANS,
    color: active ? '#ffffff' : '#64748b',
    background: active ? C.navy900 : '#ffffff',
    border: active ? 'none' : '1px solid #e2e8f0',
    boxShadow: active ? '0 2px 8px rgba(22,39,104,0.2)' : 'none',
  }}>
    {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
    {label}
  </div>
);

// ── Readiness ring (SVG) ──
export const ReadinessRing = ({ score, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: size * 0.28, fontWeight: 700, fill: C.navy900, fontFamily: FONT_SANS }}>
        {score}
      </text>
    </svg>
  );
};

// ── Presentation content area (light gradient bg matching website) ──
export const PRES_BG = 'linear-gradient(180deg, #fbfdeb 0%, #ffffff 100%)';

// ── Caption overlay (outside browser frame) ──
export const CaptionOverlay = ({ text, visible = true, position = 'bottom' }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute',
      [position]: 0, left: 0, right: 0,
      padding: position === 'bottom' ? '60px 80px 16px' : '16px 80px 60px',
      background: position === 'bottom'
        ? 'linear-gradient(to top, rgba(14,26,74,0.95) 0%, transparent 100%)'
        : 'linear-gradient(to bottom, rgba(14,26,74,0.95) 0%, transparent 100%)',
      zIndex: 50,
    }}>
      <div style={{
        fontSize: 18, fontWeight: 600, color: '#f8f2b6',
        fontFamily: FONT_SANS, textAlign: 'center',
      }}>
        {text}
      </div>
    </div>
  );
};
