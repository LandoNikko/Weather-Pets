import React from 'react';
import { Home, Cat, Settings, Info } from 'lucide-react';
import clsx from 'clsx';

interface LeftSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', color: 'text-blue-500' },
    { id: 'pets', icon: Cat, label: 'Statistics', color: 'text-pink-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-gray-600' },
    { id: 'about', icon: Info, label: 'About', color: 'text-yellow-600' },
  ];

  return (
    <>
      <div className="hidden md:flex w-20 flex-col items-center py-6 h-full">
        <div className="mb-8 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.reload()}>
          <div className="w-12 h-12 bg-primary border-2 border-border flex items-center justify-center text-white font-extrabold text-2xl rounded-xl shadow-pixel-sm active:translate-y-[2px] active:shadow-none">
            W
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                "p-3 flex justify-center transition-all group relative border-2 rounded-lg",
                "shadow-[0_2px_0px_0px_rgba(0,0,0,0.2)] active:shadow-[0_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px]",
                activeTab === item.id
                  ? 'bg-secondary border-border translate-y-[1px] shadow-[0_1px_0px_0px_rgba(0,0,0,0.2)]' 
                  : 'bg-background border-border hover:-translate-y-[1px] hover:shadow-[0_3px_0px_0px_rgba(0,0,0,0.2)]'
              )}
            >
              <item.icon size={24} className={clsx(activeTab === item.id ? 'text-border' : item.color)} />
              
              <span className="absolute left-16 bg-text text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border-2 border-white shadow-pixel-sm rounded-lg">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="md:hidden flex items-center justify-around w-full h-16 px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all border-2",
              "shadow-[0_2px_0px_0px_rgba(0,0,0,0.2)] active:shadow-[0_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px]",
              activeTab === item.id
                ? 'bg-secondary border-border translate-y-[1px] shadow-[0_1px_0px_0px_rgba(0,0,0,0.2)]' 
                : 'bg-background border-border'
            )}
          >
            <item.icon size={20} className={clsx(activeTab === item.id ? 'text-border' : item.color)} />
            <span className={clsx(
              "text-[10px] font-bold uppercase tracking-wider",
              activeTab === item.id ? 'text-border' : 'text-text/60'
            )}>
              {item.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
