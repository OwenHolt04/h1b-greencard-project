import React from 'react';
import { C } from '../lib/constants';
import { FONT_SANS } from '../lib/fonts';

const NAV_ITEMS = ['Overview', 'Case', 'Intake', 'Roles', 'Impact'];

export const AppFrame = ({ activeScreen, children }) => {
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
      {/* Navigation Bar */}
      <div
        style={{
          height: 56,
          background: C.navy900,
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: C.accent,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          CaseBridge
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 40 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item === activeScreen;
            return (
              <div
                key={item}
                style={{
                  color: isActive ? C.white : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.01em',
                }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Right side — Demo label */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 12,
              fontWeight: 500,
              padding: '4px 12px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6,
            }}
          >
            Demo Mode
          </div>
        </div>
      </div>

      {/* Content Area */}
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
