import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';
import { C, CASE } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';
import {
  BrowserFrame, WebNavBar, AnimatedCursor,
  getCursorState, getCameraState, cameraStyle,
  PCard, tileEntrance, PRES_BG, CONTENT, NAV_H,
} from './shared';

/**
 * WK2 — Smart Intake + Form Sync (18s / 540f)
 *
 * Script: "Krishna only enters his information once. Fields that today
 *  get repeated across six or more filings now populate across the
 *  entire package from a single entry."
 *
 * Phases:
 *   0-3s:   Layout appears, tiles animate in
 *   3-6s:   Camera zooms to employer name field
 *   6-10s:  Typing animation — clears wrong name, types correct name
 *   10-14s: Sync ripple — form cards flash green one by one
 *   14-18s: Camera zooms out, "6 forms synced from 1 entry" badge
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

/* ── Form fields ── */
const EMPLOYER_FIELDS = [
  { label: 'Company / Organization Name', value: CASE.employer.wrongName, syncCount: 4, fullWidth: true, editable: true },
  { label: 'Federal Employer ID (FEIN)', value: CASE.employer.fein, syncCount: 5, fullWidth: false },
  { label: 'NAICS Code', value: '541512', syncCount: 3, fullWidth: false },
  { label: 'Year Established', value: '2015', syncCount: 2, fullWidth: false },
  { label: 'Total U.S. Employees', value: CASE.employer.employees, syncCount: 3, fullWidth: false },
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

const HOW_IT_WORKS = [
  { step: '1', text: 'Enter data once in the shared record' },
  { step: '2', text: 'Fields auto-sync to all relevant forms' },
  { step: '3', text: 'Fix once → correction propagates everywhere' },
];

const SIDEBAR_W = 180;
const FORM_W = 620;

export const WK2_SmartIntake = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Typing animation (6-10s) ── */
  const typingStart = 6 * fps;
  const typingEnd = 10 * fps;
  const isTyping = frame >= typingStart && frame < typingEnd;
  const correctName = CASE.employer.name;
  const typedChars = isTyping
    ? Math.floor(interpolate(frame, [typingStart, typingEnd - 10], [0, correctName.length], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      }))
    : frame >= typingEnd ? correctName.length : 0;
  const showTypedText = typedChars > 0;

  /* ── Sync animation (10-14s) ── */
  const syncTrigger = 10 * fps;
  const syncing = frame >= syncTrigger;

  /* ── "6 forms synced" badge (14-18s) ── */
  const badgeTrigger = 14 * fps;
  const showBadge = frame >= badgeTrigger;
  const badgeOpacity = showBadge
    ? interpolate(frame - badgeTrigger, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  /* ── Editable field state ── */
  const fieldFocused = frame >= 5 * fps && frame < 12 * fps;
  const cursorBlink = Math.floor(frame / 15) % 2 === 0;

  /* ── Camera ── */
  const camera = getCameraState(frame, fps, [
    { t: 0, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 3, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
    { t: 5, zoom: 1.08, focusX: CONTENT.width * 0.4, focusY: CONTENT.height * 0.4 },
    { t: 10, zoom: 1.08, focusX: CONTENT.width * 0.4, focusY: CONTENT.height * 0.4 },
    { t: 12, zoom: 1.03, focusX: CONTENT.width * 0.55, focusY: CONTENT.height * 0.45 },
    { t: 16, zoom: 1, focusX: CONTENT.width / 2, focusY: CONTENT.height / 2 },
  ]);

  /* ── Cursor ── */
  const cursor = getCursorState(frame, fps, [
    { t: 0, x: 960, y: 500, visible: false },
    { t: 3, x: 960, y: 500, visible: false },
    { t: 3.5, x: SIDEBAR_W + 300, y: 230, visible: true },
    { t: 5, x: SIDEBAR_W + 300, y: 260, visible: true },
    { t: 5.5, x: SIDEBAR_W + 350, y: 260, click: true, visible: true },
    { t: 6, x: SIDEBAR_W + 350, y: 260, visible: true },
    { t: 10, x: SIDEBAR_W + 350, y: 260, visible: true },
    { t: 11, x: CONTENT.width - 200, y: 250, visible: true },
    { t: 14, x: CONTENT.width - 200, y: 350, visible: true },
    { t: 16, x: 960, y: 400, visible: false },
  ]);

  /* ── Tile entrance helper ── */
  const tile = (delaySec) => tileEntrance(frame, fps, delaySec);

  /* ── Render a form input field ── */
  const renderField = (f, idx) => {
    const isEditable = f.editable;
    const isActive = isEditable && fieldFocused;

    return (
      <div key={idx} style={{
        gridColumn: f.fullWidth ? '1 / -1' : undefined,
      }}>
        {/* Label + sync badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 4,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.04em',
            fontFamily: FONT_SANS,
          }}>
            {f.label}
          </span>
          <span style={{
            fontSize: 8, color: '#94a3b8', fontWeight: 600,
            background: '#f1f5f9', padding: '1px 6px', borderRadius: 4,
          }}>
            → {f.syncCount} forms
          </span>
        </div>

        {/* Input */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          padding: '8px 12px', borderRadius: 8,
          minHeight: 36,
          display: 'flex', alignItems: 'center',
          fontFamily: FONT_SANS,
          ...(isEditable ? (
            showTypedText ? {
              background: '#f0fdf4',
              border: '2px solid #86efac',
              color: '#16a34a',
            } : isActive ? {
              background: '#eff6ff',
              border: '2px solid #3b82f6',
              boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
              color: '#b45309',
            } : {
              background: '#fffbeb',
              border: '2px dashed #f59e0b',
              color: '#b45309',
            }
          ) : {
            background: 'rgba(239,246,255,0.5)',
            border: '1.5px solid #bfdbfe',
            color: C.navy900,
          }),
        }}>
          {isEditable ? (
            showTypedText ? (
              <>
                <span>{correctName.slice(0, typedChars)}</span>
                {isTyping && cursorBlink && (
                  <span style={{ borderRight: '2px solid #3b82f6', height: 16, marginLeft: 1 }} />
                )}
              </>
            ) : (
              <>
                <span>{f.value}</span>
                {!isActive && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 9, color: '#ffffff', fontWeight: 700,
                    background: C.navy900, padding: '2px 8px', borderRadius: 4,
                  }}>Fix →</span>
                )}
              </>
            )
          ) : (
            <span>{f.value}</span>
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

          {/* Content area with light gradient bg */}
          <div style={{
            position: 'absolute', top: NAV_H, left: 0,
            width: CONTENT.width, height: CONTENT.height - NAV_H,
            background: PRES_BG,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 16, paddingBottom: 16,
          }}>
            {/* Title */}
            <div style={{
              textAlign: 'center', marginBottom: 12,
              ...tile(0),
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.navy900 }}>Smart Intake</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Enter once. Auto-populate across 6 immigration forms.
              </div>
            </div>

            {/* 3-column grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `${SIDEBAR_W}px ${FORM_W}px 1fr`,
              gap: 12,
              width: 1100,
              maxWidth: CONTENT.width - 80,
              flex: 1,
              minHeight: 0,
            }}>

              {/* ── LEFT SIDEBAR ── */}
              <PCard style={{ padding: 0, overflow: 'hidden', ...tile(0.1), alignSelf: 'start' }}>
                <div style={{ paddingTop: 8 }}>
                  {SIDEBAR.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 14px',
                      background: s.active ? C.navy900 : 'transparent',
                      color: s.active ? '#ffffff' : '#64748b',
                      fontSize: 11, fontWeight: s.active ? 700 : 500,
                      fontFamily: FONT_SANS,
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: s.active ? '#60a5fa' : '#cbd5e1',
                        flexShrink: 0,
                      }} />
                      {s.label}
                    </div>
                  ))}
                </div>

                {/* Auto-sync badge */}
                <div style={{
                  margin: '12px 12px 12px',
                  padding: '8px 10px',
                  background: '#f0fdf4', borderRadius: 8,
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{
                    fontSize: 8, fontWeight: 700, color: '#166534',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    Auto-Sync Active
                  </div>
                  <div style={{ fontSize: 8, color: '#16a34a', marginTop: 2 }}>
                    Changes propagate to all 7 forms instantly
                  </div>
                </div>
              </PCard>

              {/* ── CENTER FORM ── */}
              <PCard style={{ padding: 0, overflow: 'hidden', ...tile(0.15) }}>
                {/* Header bar */}
                <div style={{
                  padding: '12px 20px',
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
                          background: C.navy900 + '14', color: C.navy900, fontWeight: 600,
                        }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form body */}
                <div style={{ padding: '16px 20px' }}>
                  {/* COMPANY IDENTITY section */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 10,
                  }}>Company Identity</div>

                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px 16px',
                  }}>
                    {EMPLOYER_FIELDS.map((f, i) => renderField(f, i))}
                  </div>

                  {/* MAILING ADDRESS section */}
                  <div style={{
                    marginTop: 20, paddingTop: 12,
                    borderTop: '1px solid #e2e8f0',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 10,
                    }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>Mailing Address</span>
                      <span style={{ fontSize: 8, color: '#cbd5e1' }}>→ propagates to all forms</span>
                    </div>

                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px 16px',
                    }}>
                      {ADDRESS_FIELDS.map((f, i) => renderField(f, i + 100))}
                    </div>
                  </div>
                </div>
              </PCard>

              {/* ── RIGHT PANEL ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Filing Package */}
                <PCard style={{ padding: '14px 14px', ...tile(0.25) }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy900 }}>Filing Package</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>6 forms</div>
                  </div>

                  {/* 2x3 grid of form cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {FORMS.map((f, i) => {
                      const formSyncDelay = syncTrigger + i * 8;
                      const formSynced = syncing && frame >= formSyncDelay;
                      const flashProgress = formSynced
                        ? interpolate(frame - formSyncDelay, [0, 8, 24], [0, 1, 0.15], {
                            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                          })
                        : 0;

                      return (
                        <PCard key={i} style={{
                          padding: '8px 10px',
                          borderTop: `3px solid ${formSynced ? '#22c55e' : C.navy900 + '25'}`,
                          background: formSynced ? `rgba(240,253,244,${0.3 + flashProgress * 0.7})` : '#ffffff',
                          boxShadow: flashProgress > 0.3 ? `0 0 12px rgba(34,197,94,${flashProgress * 0.3})` : '0 1px 3px rgba(0,0,0,0.04)',
                          ...tile(0.3 + i * 0.05),
                        }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: 3,
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.navy900 }}>{f.code}</span>
                            {formSynced ? (
                              <span style={{ fontSize: 8, color: '#22c55e', fontWeight: 700 }}>✓ Synced</span>
                            ) : (
                              <span style={{
                                fontSize: 8, background: '#f1f5f9', padding: '1px 6px',
                                borderRadius: 8, color: '#64748b', fontWeight: 600,
                              }}>{f.pct}%</span>
                            )}
                          </div>
                          <div style={{ fontSize: 9, color: '#64748b', marginBottom: 3 }}>{f.title}</div>
                          <div style={{ fontSize: 8, color: '#94a3b8' }}>{f.fields} fields synced</div>
                          {formSynced && (
                            <div style={{
                              marginTop: 4, padding: '2px 6px', borderRadius: 4,
                              background: '#dcfce7', fontSize: 7, color: '#166534',
                              opacity: interpolate(frame - formSyncDelay, [0, 10], [0, 1], {
                                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                              }),
                            }}>
                              ✓ Employer name updated
                            </div>
                          )}
                        </PCard>
                      );
                    })}
                  </div>

                  {/* Sync count badge */}
                  {showBadge && (
                    <div style={{
                      marginTop: 12, textAlign: 'center',
                      opacity: badgeOpacity,
                    }}>
                      <span style={{
                        display: 'inline-block', padding: '5px 14px', borderRadius: 16,
                        background: '#dcfce7', border: '1px solid rgba(34,197,94,0.25)',
                        fontSize: 11, fontWeight: 700, color: '#166534',
                      }}>
                        6 forms synced from 1 entry
                      </span>
                    </div>
                  )}
                </PCard>

                {/* How It Works */}
                <PCard style={{ padding: '12px 14px', ...tile(0.4) }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy900, marginBottom: 8 }}>
                    How It Works
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {HOW_IT_WORKS.map((item) => (
                      <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{
                          fontSize: 9, width: 16, height: 16, borderRadius: '50%',
                          background: C.navy900, color: '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, flexShrink: 0,
                        }}>{item.step}</span>
                        <span style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </PCard>
              </div>
            </div>
          </div>
        </div>
      </BrowserFrame>

      <AnimatedCursor {...cursor} />
    </AbsoluteFill>
  );
};
