import React from "react";

const tabs = [
  {
    id: "spin",
    label: "Spin",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill={active ? "#2AABEE" : "currentColor"} />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cases",
    label: "Cases",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M3 10h18" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M12 10v4" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
        <path d="M8 6V5a4 4 0 018 0v1" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "games",
    label: "Games",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="12" rx="3" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <circle cx="8" cy="12" r="2" fill={active ? "#2AABEE" : "currentColor"} />
        <circle cx="16" cy="10" r="1.5" fill={active ? "#2AABEE" : "currentColor"} />
        <circle cx="16" cy="14" r="1.5" fill={active ? "#2AABEE" : "currentColor"} />
      </svg>
    ),
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (active) => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={active ? "#2AABEE" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass border-t border-sg-border/50">
        <div className="flex items-center justify-around py-2 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center justify-center py-2 px-4 rounded-xl
                  transition-all duration-200 min-w-[60px]
                  ${isActive 
                    ? "text-sg-accent" 
                    : "text-sg-text-secondary hover:text-sg-text"
                  }
                `}
              >
                {tab.icon(isActive)}
                <span className={`text-[10px] mt-1 font-semibold ${isActive ? "text-sg-accent" : ""}`}>
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
