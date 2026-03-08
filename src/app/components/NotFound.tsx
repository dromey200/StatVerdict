import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-xl text-slate-400 max-w-md mx-auto">
            The path you seek has been lost to the darkness...
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg shadow-lg shadow-red-600/50 hover:shadow-red-500/60 transition-all"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition-all"
          >
            <Search className="w-5 h-5" />
            Go to Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}