import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
