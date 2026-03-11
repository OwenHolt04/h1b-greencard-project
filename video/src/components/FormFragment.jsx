import React from 'react';
import { C, FORM_FIELDS } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

/**
 * FormFragment — styled representation of a real immigration form field.
 * Shows form code header, placeholder lines, and a highlighted field value.
 */
export const FormFragment = ({
  formCode = 'I-140',
  fieldValue = '',
  highlightColor = null,
  isError = false,
  width = 320,
  scale = 1,
  opacity = 1,
  style = {},
}) => {
  const info = FORM_FIELDS[formCode] || { title: formCode, section: '', field: 'Field' };
  const borderColor = isError ? C.red500 : highlightColor || 'rgba(255,255,255,0.12)';

  return (
    <div style={{
      width, fontFamily: FONT_SANS, transform: `scale(${scale})`, opacity,
      ...style,
    }}>
      {/* Form header bar */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '8px 8px 0 0',
        padding: '6px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `2px solid ${borderColor}`,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
          {formCode}
        </span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
          USCIS
        </span>
      </div>

      {/* Form body */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${borderColor}`,
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        padding: '10px 12px',
      }}>
        {/* Placeholder lines above */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, width: '80%', marginBottom: 4 }} />
        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, width: '60%', marginBottom: 8 }} />

        {/* Section label */}
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {info.section}
        </div>

        {/* Field label */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontWeight: 600 }}>
          {info.field}
        </div>

        {/* Field value */}
        {fieldValue && (
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: isError ? C.red500 : highlightColor || C.white,
            padding: '4px 8px',
            background: isError ? 'rgba(239,68,68,0.1)' : highlightColor ? `${highlightColor}15` : 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            borderLeft: `3px solid ${isError ? C.red500 : highlightColor || 'rgba(255,255,255,0.15)'}`,
          }}>
            {fieldValue}
          </div>
        )}

        {/* Placeholder lines below */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, width: '70%', marginTop: 8 }} />
        <div style={{ height: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 2, width: '50%', marginTop: 4 }} />
      </div>
    </div>
  );
};

/**
 * ContradictionPair — two form fragments side by side with a red connecting line.
 */
export const ContradictionPair = ({
  leftCode = 'ETA-9089',
  rightCode = 'I-140',
  fieldLabel,
  leftValue,
  rightValue,
  warningProgress = 1,
  width = 280,
}) => {
  const gap = 100;
  const totalW = width * 2 + gap;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, position: 'relative', width: totalW }}>
      <FormFragment formCode={leftCode} fieldValue={leftValue} isError width={width} />

      {/* Connecting line with warning */}
      <svg style={{ position: 'absolute', left: width, top: '50%', width: gap, height: 40, transform: 'translateY(-50%)' }}>
        <line x1="0" y1="20" x2={gap} y2="20"
          stroke={C.red500} strokeWidth="2" strokeDasharray="6 4"
          opacity={warningProgress * 0.6} />
        <circle cx={gap / 2} cy="20" r={6 * warningProgress}
          fill={C.red500} opacity={warningProgress * 0.9} />
        <circle cx={gap / 2} cy="20" r={10 * warningProgress}
          fill="none" stroke={C.red500} strokeWidth="1" opacity={warningProgress * 0.4} />
      </svg>

      <FormFragment formCode={rightCode} fieldValue={rightValue} isError width={width} />
    </div>
  );
};

/**
 * CallbackIcon — small SVG icon referencing a capability scene.
 */
export const CallbackIcon = ({ type, size = 36, color = C.accent }) => {
  const s = size;
  const iconMap = {
    validation: (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="6" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="8" y1="18" x2="28" y2="18" stroke={color} strokeWidth="2" />
        <path d="M22 14l3 4-3 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    workspace: (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="12" height="12" rx="3" stroke={color} strokeWidth="1.5" opacity="0.6" />
        <rect x="20" y="4" width="12" height="12" rx="3" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <rect x="4" y="20" width="28" height="12" rx="3" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    roles: (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <circle cx="12" cy="18" r="8" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <circle cx="18" cy="12" r="8" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="18" r="8" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    deadline: (
      <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="13" stroke={color} strokeWidth="1.5" opacity="0.5" />
        <line x1="18" y1="10" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="18" x2="24" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };

  return iconMap[type] || null;
};
