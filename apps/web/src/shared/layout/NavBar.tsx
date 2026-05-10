import { Link } from 'react-router-dom';
import { NavUser } from './NavUser';

export function Navbar() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link to="/">
          <div className="text-xl font-bold">MiaGo!</div>
        </Link>

        {/* Auth */}
        <NavUser />
      </div>
    </header>
  );
}
