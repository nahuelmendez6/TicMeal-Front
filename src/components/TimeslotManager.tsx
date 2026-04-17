import React, { useEffect, useState } from 'react';
import { useTimeslots } from '../hooks/useTimeslots';
import Card from './common/Card';
import Button from './common/Button';
import { Plus, Trash2, Clock, Users } from 'lucide-react';
import type { CreateTimeslotDto } from '../types/reservation';

const TimeslotManager: React.FC = () => {
  const { timeslots, loading, error, fetchTimeslots, createTimeslot, deleteTimeslot } = useTimeslots();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateTimeslotDto>({
    startTime: '',
    endTime: '',
    capacity: 0
  });

  useEffect(() => {
    fetchTimeslots();
  }, [fetchTimeslots]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTimeslot(formData);
      setShowForm(false);
      setFormData({ startTime: '', endTime: '', capacity: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Slots de Entrega</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="me-2" />
          Nuevo Slot
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <Card className="mb-4" title="Agregar Nuevo Slot">
          <form onSubmit={handleSubmit} className="row align-items-end g-3">
            <div className="col-md-3">
              <label className="form-label">Hora Inicio</label>
              <input 
                type="time" 
                name="startTime" 
                className="form-control" 
                value={formData.startTime} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Hora Fin</label>
              <input 
                type="time" 
                name="endTime" 
                className="form-control" 
                value={formData.endTime} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Capacidad Máxima</label>
              <input 
                type="number" 
                name="capacity" 
                className="form-control" 
                value={formData.capacity} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="col-md-3">
              <Button type="submit" variant="primary" className="w-100" loading={loading}>
                Guardar Slot
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="row g-4">
        {loading && timeslots.length === 0 ? (
          <p className="text-center">Cargando slots...</p>
        ) : timeslots.length === 0 ? (
          <p className="text-center text-muted">No hay slots configurados.</p>
        ) : (
          timeslots.map(slot => (
            <div key={slot.id} className="col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 bg-light">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => deleteTimeslot(slot.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h5 className="card-title mb-1">{slot.startTime} - {slot.endTime}</h5>
                  <div className="d-flex align-items-center text-muted">
                    <Users size={16} className="me-2" />
                    <span>Capacidad: {slot.capacity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimeslotManager;
