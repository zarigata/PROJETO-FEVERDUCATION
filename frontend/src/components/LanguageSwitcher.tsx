import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  return (
    <div className="p-4">
      <select value={i18n.language} onChange={changeLang} className="border p-1 rounded">
        <option value="en">EN</option>
        <option value="pt">PT</option>
        <option value="jp">JP</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
