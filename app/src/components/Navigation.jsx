import { useDemo } from '../context/DemoContext';
import { RotateCcw } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'dashboard', label: 'Case' },
  { id: 'intake', label: 'Intake' },
  { id: 'roles', label: 'Roles' },
  { id: 'impact', label: 'Impact' },
];

export default function Navigation() {
  const { currentScreen, navigate, resetDemo } = useDemo();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('overview')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CaseBridge</span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                currentScreen === item.id
                  ? 'bg-white/12 text-white'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={resetDemo}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[12px] font-medium transition-colors cursor-pointer"
          title="Reset demo to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </nav>
  );
}
