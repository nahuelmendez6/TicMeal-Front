import React from 'react';
import PageLayout from '../components/common/PageLayout';
import Card from '../components/common/Card';

const Dashboard: React.FC = () => {
  return (
    <PageLayout title="Dashboard">
      <div className="row">
        <div className="col-12">
          <Card>
            <h5 className="card-title">Bienvenido al Sistema de TicMeal de gestión de comedores</h5>
            <p className="card-text">Seleccione una opción del menú lateral para comenzar.</p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

