import React from "react";

const tabs = [
  {
    id: "spin",
    label: "Spin",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill={active ? "#2AABEE" : "currentColor"} />
      </svg>
    ),
  },
  {
    id: "cases",
    label: "Cases",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="2" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M4 10h16" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M9 6V4a3 3 0 016 0v2" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "games",
    label: "Games",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="10" rx="3" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <circle cx="8" cy="12" r="1.5" fill={active ? "#2AABEE" : "currentColor"} />
        <circle cx="16" cy="10" r="1" fill={active ? "#2AABEE" : "currentColor"} />
        <circle cx="16" cy="14" r="1" fill={active ? "#2AABEE" : "currentColor"} />
      </svg>
    ),
  },
  {
    id: "inventory",
    label: "Items",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass border-t border-white/5">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center justify-center py-1.5 px-3 rounded-xl
                  transition-all duration-200 min-w-[56px]
                  ${isActive 
                    ? "text-accent" 
                    : "text-white/40 hover:text-white/60"
                  }
                `}
              >
                {tab.icon(isActive)}
                <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? "text-accent" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
