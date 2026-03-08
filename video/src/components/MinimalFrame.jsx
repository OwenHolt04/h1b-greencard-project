import React from 'react';
import { C } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

/**
 * Minimal app chrome — 36px navy bar with logo + active screen label.
 * Replaces the full AppFrame to reclaim vertical space in the video.
 */
export const MinimalFrame = ({ activeScreen, children }) => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: C.surface,
        fontFamily: FONT_SANS,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Minimal nav bar */}
      <div
        style={{
          height: 36,
          background: C.navy900,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: C.accent,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          CaseBridge
        </div>
        {activeScreen && (
          <>
            <div
              style={{
                width: 1,
                height: 14,
                background: 'rgba(255,255,255,0.15)',
                margin: '0 12px',
              }}
            />
            <div
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.03em',
              }}
            >
              {activeScreen}
            </div>
          </>
        )}
      </div>

      {/* Content area — 1044px tall */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
