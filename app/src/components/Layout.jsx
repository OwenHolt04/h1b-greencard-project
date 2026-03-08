import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <Navigation />
      <main className="pt-14">{children}</main>
    </div>
  );
}
