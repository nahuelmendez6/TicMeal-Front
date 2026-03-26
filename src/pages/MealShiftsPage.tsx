// src/pages/MealShiftsPage.tsx

// src/pages/MealShiftsPage.tsx

import React from 'react';
import MealShiftManager from '../components/MealShiftManager';
import PageLayout from '../components/common/PageLayout';

const MealShiftsPage: React.FC = () => {
  return (
    <PageLayout title="Gestión de Turnos de Comida">
      <MealShiftManager />
    </PageLayout>
  );
};

export default MealShiftsPage;
