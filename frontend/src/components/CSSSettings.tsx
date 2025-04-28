import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPreferences, savePreferences } from '../services/UserPreferences';

const presets = [
  { label: 'preset_light', file: '/styles/presets/light.css' },
  { label: 'preset_dark', file: '/styles/presets/dark.css' },
  { label: 'preset_high_contrast', file: '/styles/presets/high-contrast.css' },
  { label: 'preset_sepia', file: '/styles/presets/sepia.css' },
  { label: 'preset_neon', file: '/styles/presets/neon.css' },
];

const CSSSettings: React.FC = () => {
  const { t } = useTranslation();
  // CODEX: Initialize with saved preference or default
  const [current, setCurrent] = useState(getPreferences().theme || presets[0].file);

  useEffect(() => {
    // CODEX: Apply theme to document
    let link = document.getElementById('theme-css') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'theme-css';
      document.head.appendChild(link);
    }
    link.href = current;
    
    // CODEX: Save preference to storage
    savePreferences({ theme: current });
  }, [current]);

  const handlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrent(e.target.value);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCurrent(url);
  };

  return (
    <div className="space-y-4">
      {/* CODEX: Enhanced theme selector with visual preview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {presets.map(p => (
          <div 
            key={p.file} 
            onClick={() => setCurrent(p.file)}
            className={`cursor-pointer rounded-lg p-2 border-2 transition-all duration-200 hover:scale-105 ${current === p.file ? 'border-[var(--primary-color)]' : 'border-transparent'}`}
          >
            <div className={`h-12 rounded-md mb-2 shadow-md ${p.label === 'preset_light' ? 'bg-gray-100' : 
              p.label === 'preset_dark' ? 'bg-gray-800' :
              p.label === 'preset_high_contrast' ? 'bg-black' :
              p.label === 'preset_sepia' ? 'bg-amber-100' :
              'bg-purple-900'}`}>
              <div className={`h-3 w-1/2 rounded-full mt-2 ml-2 ${p.label === 'preset_light' ? 'bg-blue-500' : 
                p.label === 'preset_dark' ? 'bg-purple-500' :
                p.label === 'preset_high_contrast' ? 'bg-yellow-400' :
                p.label === 'preset_sepia' ? 'bg-amber-700' :
                'bg-pink-500'}`}>
              </div>
            </div>
            <div className="text-center text-sm font-medium text-[var(--text-color)]">
              {t(p.label)}
            </div>
          </div>
        ))}
      </div>
      
      {/* CODEX: Custom CSS upload option */}
      <div className="mt-4 p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] transition-colors duration-300">
        <label className="block mb-2 text-sm font-medium text-[var(--text-color)]">{t('upload_css_label')}</label>
        <div className="flex items-center">
          <input 
            type="file" 
            accept=".css" 
            onChange={handleUpload} 
            className="block w-full text-sm text-[var(--text-color)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--secondary-color)] transition-colors duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default CSSSettings;
