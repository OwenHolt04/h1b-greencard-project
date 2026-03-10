import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DemoProvider, useDemo } from './context/DemoContext';
import Layout from './components/Layout';
import FormExplorer from './components/FormExplorer';
import PresentationShell from './presentation/PresentationShell';
import Overview from './screens/Overview';
import Dashboard from './screens/Dashboard';
import Intake from './screens/Intake';
import Roles from './screens/Roles';
import Impact from './screens/Impact';

const screens = {
  overview: Overview,
  dashboard: Dashboard,
  intake: Intake,
  roles: Roles,
  impact: Impact,
};

function ScreenRouter() {
  const { currentScreen } = useDemo();
  const Screen = screens[currentScreen] || Overview;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { presentationMode, setPresentationMode } = useDemo();

  // P key toggles presentation mode from normal app
  useEffect(() => {
    if (presentationMode) return; // PresentationShell has its own key handler
    const handler = (e) => {
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setPresentationMode(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [presentationMode, setPresentationMode]);

  if (presentationMode) {
    return <PresentationShell />;
  }

  return (
    <>
      <Layout>
        <ScreenRouter />
      </Layout>
      <FormExplorer />
    </>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <AppContent />
    </DemoProvider>
  );
}
