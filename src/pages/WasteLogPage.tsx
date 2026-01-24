// src/pages/WasteLogPage.tsx
import React, { useEffect } from 'react';
import { useWaste } from '../hooks/useWaste';
import WasteLogTable from '../components/waste/WasteLogTable';


const WasteLogPage: React.FC = () => {
  const { wasteLogs, isLoading, error, fetchWasteLogs } = useWaste();

  useEffect(() => {
    fetchWasteLogs();
  }, [fetchWasteLogs]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    if (error) {
      return <div className="alert alert-danger mt-3">{error}</div>;
    }

    if (wasteLogs.length === 0) {
      return <div className="alert alert-info mt-3">No hay registros de merma todavía.</div>;
    }

    return <WasteLogTable wasteLogs={wasteLogs} />;
  };

  return (
    // <Layout>
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title mb-0">Historial de Mermas</h1>
          </div>
          <div className="card-body">
            {renderContent()}
          </div>
        </div>
      </div>
    // </Layout>
  );
};

export default WasteLogPage;
