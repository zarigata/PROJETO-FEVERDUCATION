import React from 'react';

interface TabNavProps {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, active, onChange }) => {
  return (
    <nav role="tablist" className="flex border-b bg-white">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={`py-2 px-4 -mb-px focus:outline-none ${
            active === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNav;
