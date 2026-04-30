import React, { useEffect, useState, useMemo } from 'react';
import GlowCard from './GlowCard';

const tabs = [
  { label: 'Network Map', icon: 'map' },
  { label: 'MST Designer', icon: 'mst' },
  { label: 'Route Planner', icon: 'route' },
  { label: 'Algorithm Race', icon: 'race' },
  { label: 'Public Transit', icon: 'transit' },
  { label: 'Traffic Signals', icon: 'signal' },
  { label: 'ML Prediction', icon: 'ml' },
  { label: 'Performance Dashboard', icon: 'dashboard' },
];

function SidebarIcon({ kind }) {
  const iconProps = {
    className: 'sidebar-icon-svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  switch (kind) {
    case 'map':
      return (
        <svg {...iconProps}>
          <path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z" />
          <path d="M9 4v14" />
          <path d="M15 6v14" />
        </svg>
      );
    case 'mst':
      return (
        <svg {...iconProps}>
          <path d="M12 4v16" />
          <path d="M5 9l7 7 7-7" />
          <path d="M5 15l7-7 7 7" />
        </svg>
      );
    case 'route':
      return (
        <svg {...iconProps}>
          <path d="M5 18c4-1 5-5 7-8s3-5 7-6" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="4" r="2" />
        </svg>
      );
    case 'race':
      return (
        <svg {...iconProps}>
          <path d="M5 17h10" />
          <path d="M7 7h6a4 4 0 0 1 4 4v6" />
          <path d="M17 7h2l-2 4" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );
    case 'transit':
      return (
        <svg {...iconProps}>
          <rect x="6" y="4" width="12" height="13" rx="4" />
          <path d="M8 20l2-3" />
          <path d="M16 20l-2-3" />
          <path d="M9 8h0" />
          <path d="M15 8h0" />
        </svg>
      );
    case 'signal':
      return (
        <svg {...iconProps}>
          <rect x="10" y="3" width="4" height="18" rx="2" />
          <circle cx="12" cy="7" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="17" r="1.7" />
        </svg>
      );
    case 'ml':
      return (
        <svg {...iconProps}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M8 7l4 4" />
          <path d="M16 7l-4 4" />
          <path d="M8 17l4-4" />
          <path d="M16 17l-4-4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M4 12h16" />
          <path d="M12 4v16" />
        </svg>
      );
  }
}

function CairoClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Africa/Cairo',
      });
      setTime(fmt.format(now));
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = parseInt(time.split(':')[0], 10) || 0;
  const isDay = hour >= 6 && hour < 18;

  return (
    <div className="sidebar-clock" aria-label="Cairo time" role="timer">
      <span className="sidebar-clock-label">Cairo Time</span>
      <div className="sidebar-clock-row">
        <span className={`sun-moon ${isDay ? 'day' : 'night'}`} aria-hidden="true">
          {isDay ? (
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
          )}
        </span>
        <strong aria-live="polite">{time || '00:00:00'}</strong>
      </div>
    </div>
  );
}

export default function Sidebar({ activeTab, onSelectTab }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed((s) => !s);

  const skyline = useMemo(() => {
    return (
      <svg viewBox="0 0 120 32" className="sidebar-skyline" aria-hidden="true">
        <rect x="0" y="22" width="120" height="10" fill="rgba(0,0,0,0.0)" />
        <path d="M2 22 L8 12 L14 22 L20 8 L28 22 L36 16 L44 22 L54 6 L64 22 L74 10 L84 22 L96 14 L108 22 L118 8" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <g className="skyline-lights">
          <circle cx="28" cy="18" r="0.9" />
          <circle cx="54" cy="10" r="0.9" />
          <circle cx="84" cy="18" r="0.9" />
        </g>
      </svg>
    );
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-edge" aria-hidden="true" />

      <div className="sidebar-brand">
        <div className="sidebar-logo" aria-hidden="true">
          <div className="logo-halo" />
          <svg viewBox="0 0 64 48" className="sidebar-logo-svg">
            <path d="M4 40h56" />
            <path d="M8 40V26h7v14" />
            <path d="M19 40V18h7v22" />
            <path d="M30 40V22h6v18" />
            <path d="M40 40V14h8v26" />
            <path d="M51 40V24h7v16" />
            <path d="M13 26l4-6 4 6" />
            <path d="M44 14l4-8 4 8" />
          </svg>
        </div>
        <div className="sidebar-brand-copy">
          <h1>Control Room</h1>
          <p>Cairo traffic command center</p>
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleCollapsed}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 24 24" className="sidebar-toggle-icon" aria-hidden="true">
            <path d={collapsed ? 'M6 18L18 6M6 6h12v12' : 'M18 6L6 18M6 6h12v12'} strokeWidth="1.8" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sidebar-skyline-wrap">{skyline}</div>
      </div>

      <nav className="sidebar-nav" role="navigation">
        {tabs.map((tab) => {
          const tooltipId = `sidebar-tooltip-${tab.label.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <button
              key={tab.label}
              type="button"
              className={tab.label === activeTab ? 'sidebar-tab active' : 'sidebar-tab'}
              onClick={() => onSelectTab(tab.label)}
              aria-label={tab.label}
              aria-describedby={tooltipId}
              title={tab.label}
            >
              <span className="sidebar-tab-icon" aria-hidden="true">
                <span className="icon-halo" />
                <SidebarIcon kind={tab.icon} />
              </span>
              <span className="sidebar-tab-label">{tab.label}</span>
              <span id={tooltipId} className="sidebar-tooltip" aria-hidden="true">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <GlowCard className="sidebar-stat">
          <span>Mode</span>
          <strong>Dark Dashboard</strong>
        </GlowCard>
        <GlowCard className="sidebar-stat">
          <span>Backend</span>
          <strong>FastAPI</strong>
        </GlowCard>
        <GlowCard className="sidebar-stat">
          <span>Frontend</span>
          <strong>React</strong>
        </GlowCard>
        <div className="sidebar-clock-wrap">
          <CairoClock />
        </div>
      </div>
    </aside>
  );
}
