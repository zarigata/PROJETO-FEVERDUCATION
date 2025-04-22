import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const presets = [
  { label: 'preset_light', file: '/styles/presets/light.css' },
  { label: 'preset_dark', file: '/styles/presets/dark.css' },
  { label: 'preset_high_contrast', file: '/styles/presets/high-contrast.css' },
];

const CSSSettings: React.FC = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(presets[0].file);

  useEffect(() => {
    let link = document.getElementById('theme-css') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'theme-css';
      document.head.appendChild(link);
    }
    link.href = current;
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
    <div className="p-4">
      <label className="mr-2">{t('css_preset_label')}:</label>
      <select onChange={handlePreset} className="border p-1 rounded">
        {presets.map(p => (
          <option key={p.file} value={p.file}>
            {t(p.label)}
          </option>
        ))}
      </select>
      <div className="mt-2">
        <label className="mr-2">{t('upload_css_label')}:</label>
        <input type="file" accept=".css" onChange={handleUpload} />
      </div>
    </div>
  );
};

export default CSSSettings;
