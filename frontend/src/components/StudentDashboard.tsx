import React from 'react';
import { useTranslation } from 'react-i18next';

const StudentDashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">{t('student_dashboard')}</h1>
      {/* TODO: Fetch and display analytics, classrooms, grades, AI Tutor chat */}
      <p>{t('student_dashboard')}</p>
    </div>
  );
};

export default StudentDashboard;
