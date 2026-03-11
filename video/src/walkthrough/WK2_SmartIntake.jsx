import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS, FONT_DISPLAY } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  WebCard, CONTENT, NAV_H,
} from './shared';

/**
 * WK2 — Smart Intake + Form Sync (22s / 660f)
 *
 * Script: "Krishna only enters his information once. Fields that today
 *  get repeated across six or more filings now populate across the
 *  entire package from a single entry."
 *
 * Visual: Real form with sidebar navigation, visible input fields with
 *  light blue backgrounds, section headers, sync badges. Cursor types
 *  into employer field, sync ripples across 6 form cards.
 *
 * Phases:
 *   0-3s:   Full layout appears — sidebar + form + form cards
 *   3-8s:   Camera zooms into employer section, cursor highlights employer field
 *   8-10s:  Cursor "edits" employer field (text appears letter by letter)
 *   10-14s: Sync ripple — green flash propagates across 6 form cards
 *   14-16s: "Enter once." kinetic text
 *   16-22s: Camera shows full layout, "6 forms synced" badge
 */

/* ── Sidebar sections ── */
const SIDEBAR = [
  { label: 'Employer Info', active: true },
  { label: 'Beneficiary Info', active: false },
  { label: 'Position Details', active: false },
  { label: 'Wage & LCA', active: false },
  { label: 'Recruitment', active: false },
  { label: 'Work History', active: false },
  { label: 'Generate Docs', active: false },
];

/* ── Form fields for employer section (with real input styling) ── */
const EMPLOYER_FIELDS = [
  { label: 'Company / Organization Name', value: CASE.employer.name, syncCount: 4, fullWidth: true, editable: true },
  { label: 'Federal Employer ID (FEIN)', value: 'XX-XXXXXXX', syncCount: 5, fullWidth: false },
  { label: 'NAICS Code', value: '541512', syncCount: 3, fullWidth: false },
  { label: 'Year Established', value: '2015', syncCount: 2, fullWidth: false },
  { label: 'Total U.S. Employees', value: '~62,000', syncCount: 3, fullWidth: false },
];

const ADDRESS_FIELDS = [
  { label: 'Street Address', value: '1701 E Mossy Oaks Rd', syncCount: 5, fullWidth: true },
  { label: 'City', value: 'Spring', syncCount: 5, fullWidth: false },
  { label: 'State', value: 'TX', syncCount: 5, fullWidth: false },
  { label: 'ZIP Code', value: '77389', syncCount: 5, fullWidth: false },
  { label: 'Phone', value: '(281) 370-0670', syncCount: 4, fullWidth: false },
];

const SHARED_FORMS = ['I-129', 'I-140', 'ETA-9089', 'ETA-9142A'];

const FORMS = [
  { code: 'ETA-9089', title: 'PERM Application', fields: 14, pct: 100 },
  { code: 'I-140', title: 'Immigrant Petition', fields: 12, pct: 100 },
  { code: 'I-485', title: 'Adjustment of Status', fields: 24, pct: 82 },
  { code: 'I-765', title: 'Employment Auth (EAD)', fields: 7, pct: 90 },
  { code: 'I-131', title: 'Advance Parole', fields: 6, pct: 88 },
  { code: 'G-28', title: 'Attorney Representation', fields: 4, pct: 100 },
];

const SIDEBAR_W = 180;
const FORM_W = 620;

export const WK2_SmartIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typing animation for employer field (8-10s)
  const typingStart = 8 * fps;
  const typingEnd = 10 * fps;
  const isTyping = frame >= typingStart && frame < typingEnd;
  const fullText = CASE.employer.name;
  const typedChars = isTyping
    ? Math.floor(interpolate(frame, [typingStart, typingEnd - 10], [0, fullText.length], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }))
    : frame >= typingEnd ? fullText.length : 0;

  // Sync animation: starts at ~10s
  const syncTrigger = 10 * fps;
  const syncing = frame >= syncTrigger;
  const syncFlash = syncing ? interpolate(frame - syncTrigger, [0, 10, 30], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) : 0;

  // Camera
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 5, zoom: 1.5, focusX: SIDEBAR_W + 220, focusY: 280 },        // zoom into company name field
    { t: 10, zoom: 1.5, focusX: SIDEBAR_W + 220, focusY: 280 },       // hold during typing
    { t: 12, zoom: 1.15, focusX: CONTENT.width * 0.65, focusY: 350 }, // pan to show forms
    { t: 16, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  // Cursor
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 1, x: 960, y: 500, visible: true },
    { t: 2, x: 520, y: 96, visible: true },                       // Intake tab
    { t: 2.5, x: 520, y: 96, click: true, visible: true },
    { t: 4, x: SIDEBAR_W + 300, y: 200, visible: true },          // hover form area
    { t: 6, x: SIDEBAR_W + 300, y: 260, visible: true },          // hover company field
    { t: 7.5, x: SIDEBAR_W + 350, y: 270, visible: true },        // click into field
    { t: 8, x: SIDEBAR_W + 350, y: 270, click: true, visible: true },
    { t: 10, x: SIDEBAR_W + 350, y: 270, visible: true },         // done typing
    { t: 12, x: CONTENT.width - 300, y: 300, visible: true },     // move to form cards
    { t: 15, x: 960, y: 400, visible: true },
    { t: 21, x: 960, y: 500, visible: false },
  ]);

  // "Enter once." kinetic
  const kineticFrame = 14 * fps;
  const kineticIn = spring({ frame, fps, config: { damping: 16, stiffness: 180 }, delay: kineticFrame });
  const kineticExit = interpolate(frame, [kineticFrame + 50, kineticFrame + 65], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Editable field highlight
  const editFocused = frame >= 6 * fps && frame < 12 * fps;
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  /* ── Render an input field ── */
  const renderField = (f, fi, isEmployer) => {
    const isEditable = f.editable;
    const isActive = isEditable && editFocused;
    const showTyped = isEditable && typedChars > 0;

    return (
      <div key={fi} style={{
        gridColumn: f.fullWidth ? '1 / -1' : undefined,
      }}>
        {/* Label with sync badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 4,
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {f.label}
          </span>
          <span style={{
            fontSize: 8, color: '#94a3b8', fontWeight: 600,
            background: '#f1f5f9', padding: '1px 6px', borderRadius: 4,
          }}>
            {'\u2192'} {f.syncCount} forms
          </span>
        </div>
        {/* Input field — visible border + light blue bg */}
        <div style={{
          fontSize: 13, fontWeight: 600, color: C.navy900,
          padding: '8px 12px', borderRadius: 8,
          background: isActive ? '#eff6ff' : showTyped ? '#f0fdf4' : '#eff6ff80',
          border: isActive ? '2px solid #3b82f6' : isEditable && !showTyped ? '2px dashed #f59e0b' : '1.5px solid #bfdbfe',
          boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
          display: 'flex', alignItems: 'center',
          minHeight: 34,
          transition: 'all 0.2s',
        }}>
          {showTyped ? (
            <>
              <span style={{ color: '#16a34a' }}>{fullText.slice(0, typedChars)}</span>
              {isTyping && cursorBlink && (
                <span style={{ borderRight: '2px solid #3b82f6', height: 16, marginLeft: 1 }} />
              )}
            </>
          ) : (
            <span style={{
              color: isEditable ? '#b45309' : C.navy900,
            }}>{f.value}</span>
          )}
          {isEditable && !isActive && !showTyped && (
            <span style={{
              marginLeft: 'auto', fontSize: 9, color: '#ffffff', fontWeight: 700,
              background: C.navy900, padding: '2px 8px', borderRadius: 4,
            }}>Fix {'\u2192'}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #0e1a4a 0%, ${C.navy900} 40%, ${C.navy800} 100%)`,
      fontFamily: FONT_SANS,
    }}>
      <BrowserFrame>
        <div style={cameraStyle(camera)}>
          <WebNavBar activeTab="Intake" />

          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            display: 'grid', gridTemplateColumns: `${SIDEBAR_W}px ${FORM_W}px 1fr`,
            gap: 0,
          }}>
            {/* ── SIDEBAR: Section Navigation ── */}
            <div style={{
              borderRight: '1px solid #e2e8f0',
              background: '#ffffff',
              paddingTop: 8,
            }}>
              {SIDEBAR.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px',
                  background: s.active ? C.navy900 : 'transparent',
                  color: s.active ? '#ffffff' : '#64748b',
                  fontSize: 11, fontWeight: s.active ? 700 : 500,
                  cursor: 'default',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: s.active ? '#60a5fa' : '#cbd5e1',
                  }} />
                  {s.label}
                </div>
              ))}
              {/* Auto-sync badge */}
              <div style={{
                margin: '16px 12px 0',
                padding: '8px 10px',
                background: '#f0fdf4', borderRadius: 8,
                border: '1px solid #bbf7d0',
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Auto-Sync Active
                </div>
                <div style={{ fontSize: 8, color: '#16a34a', marginTop: 2 }}>
                  Changes propagate to all 7 forms instantly
                </div>
              </div>
            </div>

            {/* ── CENTER: Form Content ── */}
            <div style={{
              borderRight: '1px solid #e2e8f0',
              background: '#ffffff',
              overflowY: 'hidden',
            }}>
              {/* Form header */}
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.navy900 }}>Employer Information</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                      Shared across: I-129 Part 1, I-140 Part 1, ETA-9089 Sec C, ETA-9142A Sec B
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {SHARED_FORMS.map((f) => (
                      <span key={f} style={{
                        fontSize: 9, padding: '2px 8px', borderRadius: 4,
                        background: C.navy900 + '12', color: C.navy900, fontWeight: 600,
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company Identity section */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 10,
                }}>Company Identity</div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px 16px',
                }}>
                  {EMPLOYER_FIELDS.map((f, i) => renderField(f, i, true))}
                </div>

                {/* Mailing Address section */}
                <div style={{
                  marginTop: 20, paddingTop: 12,
                  borderTop: '1px solid #e2e8f0',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 10,
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>Mailing Address</span>
                    <span style={{ fontSize: 8, color: '#cbd5e1' }}>{'\u2192'} propagates to all forms</span>
                  </div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px 16px',
                  }}>
                    {ADDRESS_FIELDS.map((f, i) => renderField(f, i + 10, false))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Downstream Forms ── */}
            <div style={{ padding: '16px 16px', background: '#f8fafc' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 12,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy900 }}>Filing Package</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>6 forms</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {FORMS.map((f, i) => {
                  const formSynced = syncing && frame >= syncTrigger + i * 5;
                  return (
                    <WebCard key={i} glow={formSynced && syncFlash > 0.1} style={{
                      borderTop: `3px solid ${formSynced ? '#22c55e' : C.navy900 + '30'}`,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: 4,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.navy900 }}>{f.code}</span>
                        {formSynced
                          ? <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>{'\u2713'} Synced</span>
                          : <span style={{ fontSize: 8, background: '#f1f5f9', padding: '1px 6px', borderRadius: 8, color: '#64748b', fontWeight: 600 }}>{f.pct}%</span>
                        }
                      </div>
                      <div style={{ fontSize: 9, color: '#64748b', marginBottom: 4 }}>{f.title}</div>
                      <div style={{ fontSize: 8, color: '#94a3b8' }}>{f.fields} fields synced</div>

                      {formSynced && (
                        <div style={{
                          marginTop: 5, padding: '3px 6px', borderRadius: 4,
                          background: '#dcfce7', fontSize: 8, color: '#166534',
                        }}>
                          {'\u2713'} Employer name updated
                        </div>
                      )}
                    </WebCard>
                  );
                })}
              </div>

              {/* Sync count badge */}
              {syncing && (
                <div style={{
                  marginTop: 12, textAlign: 'center',
                  opacity: interpolate(frame - syncTrigger, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}>
                  <span style={{
                    display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                    background: '#dcfce7', border: '1px solid #22c55e40',
                    fontSize: 11, fontWeight: 700, color: '#166534',
                  }}>
                    6 forms synced from 1 entry
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />

      {/* Kinetic "Enter once." text */}
      {frame > kineticFrame && frame < kineticFrame + 65 && (
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: `translate(-50%, -50%) scale(${interpolate(kineticIn, [0, 1], [0.8, 1])})`,
          zIndex: 60, opacity: interpolate(kineticIn, [0, 1], [0, 1]) * kineticExit,
        }}>
          <div style={{
            fontSize: 56, fontWeight: 700, fontFamily: FONT_DISPLAY, color: C.accent,
            textShadow: '0 0 80px rgba(14,26,74,0.95), 0 0 160px rgba(14,26,74,0.9)',
          }}>
            Enter once.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
