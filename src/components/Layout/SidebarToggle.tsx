import { Menu } from 'lucide-react';

interface SidebarToggleProps {
  onClick: () => void;
}

export function SidebarToggle({ onClick }: SidebarToggleProps) {
  return (
    <div className="fixed top-0 left-0 h-full w-12 bg-slate-800 flex items-start justify-center pt-4 z-50">
      <button
        onClick={onClick}
        className="p-2 rounded-md hover:bg-slate-700 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
