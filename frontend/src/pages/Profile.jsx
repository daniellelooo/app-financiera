import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Ana García',
    email: 'ana.garcia@universidad.edu',
    phone: '+57 300 123 4567',
    position: 'Coordinadora Académica',
    department: 'Facultad de Ingeniería',
    location: 'Medellín, Colombia',
    bio: 'Coordinadora académica con 8 años de experiencia en gestión educativa y tecnológica.'
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardarían los cambios
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí se revertirían los cambios
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="card-title">Mi Perfil</h1>
          {!isEditing ? (
            <button onClick={handleEdit} className="btn btn-primary">
              <Edit size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Editar
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSave} className="btn btn-primary">
                <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Guardar
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                <X size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <User size={60} color="white" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{userData.name}</h3>
            <p style={{ margin: 0, color: '#666' }}>{userData.position}</p>
          </div>

          <div>
            <div className="form-group">
              <label className="form-label">
                <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Nombre Completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={userData.name}
                  onChange={handleChange}
                />
              ) : (
                <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  {userData.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Correo Electrónico
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={userData.email}
                  onChange={handleChange}
                />
              ) : (
                <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  {userData.email}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={userData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  {userData.phone}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Ubicación
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  value={userData.location}
                  onChange={handleChange}
                />
              ) : (
                <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  {userData.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Información Profesional</h3>
        
        <div className="form-group">
          <label className="form-label">Cargo</label>
          {isEditing ? (
            <input
              type="text"
              name="position"
              className="form-input"
              value={userData.position}
              onChange={handleChange}
            />
          ) : (
            <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
              {userData.position}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Departamento</label>
          {isEditing ? (
            <input
              type="text"
              name="department"
              className="form-input"
              value={userData.department}
              onChange={handleChange}
            />
          ) : (
            <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
              {userData.department}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Biografía</label>
          {isEditing ? (
            <textarea
              name="bio"
              className="form-input"
              value={userData.bio}
              onChange={handleChange}
              rows={4}
              style={{ resize: 'vertical' }}
            />
          ) : (
            <p style={{ margin: '0.5rem 0', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
              {userData.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
