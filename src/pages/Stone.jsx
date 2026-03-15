import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import { t } from '../i18n';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_URL || '';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function StoneMap({ entries }) {
  const coords = entries
    .filter(e => e.latitude && e.longitude)
    .map(e => [parseFloat(e.latitude), parseFloat(e.longitude)]);

  if (coords.length === 0) return null;

  const center = coords[coords.length - 1];

  return (
    <MapContainer center={center} zoom={5} className="map-container" scrollWheelZoom={false}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords.length > 1 && (
        <Polyline
          positions={coords}
          color="#6B7F5E"
          weight={2}
          opacity={0.7}
          dashArray="5, 5"
        />
      )}
      {entries.filter(e => e.latitude && e.longitude).map((entry, i) => (
        <Marker key={entry.id} position={[parseFloat(entry.latitude), parseFloat(entry.longitude)]}>
          <Popup>
            <strong>{entry.name}</strong><br />
            {entry.location_name || ''}<br />
            <small>{formatDate(entry.created_at)}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function EntryCard({ entry }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="entry-card">
      <div className="entry-header">
        <div className="entry-name">{entry.name}</div>
        <div className="entry-date">{formatDate(entry.created_at)}</div>
      </div>
      {(entry.location_name || entry.latitude) && (
        <div className="entry-location">
          📍 {entry.location_name || `${parseFloat(entry.latitude).toFixed(4)}, ${parseFloat(entry.longitude).toFixed(4)}`}
        </div>
      )}
      {entry.message && <p className="entry-message">{entry.message}</p>}
      {entry.photos && entry.photos.length > 0 && (
        <div className="entry-photos">
          {entry.photos.map((photo, i) => (
            <img
              key={i}
              src={`${UPLOAD_BASE}/uploads/${photo}`}
              alt=""
              className="entry-photo"
              onClick={() => setLightbox(`${UPLOAD_BASE}/uploads/${photo}`)}
            />
          ))}
        </div>
      )}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
  );
}

function AddEntryForm({ stoneNumber, onSuccess }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [gpsStatus, setGpsStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const getGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus(t('gpsError'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
        setGpsStatus(t('gpsSuccess'));
      },
      () => setGpsStatus(t('gpsError'))
    );
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError(t('nameRequired'));
    if (photos.length === 0) return setError(t('photoRequired'));
    if (!latitude && !locationName.trim()) return setError(t('locationRequired'));

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (message) formData.append('message', message);
      if (locationName) formData.append('location_name', locationName);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      photos.forEach(p => formData.append('photos', p));

      await api.post(`/stones/${stoneNumber}/entries`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-entry-section">
      <div className="container">
        <div className="form-card">
          <h2>{t('addEntryTitle')}</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {t('fieldName')} <span className="required">{t('required')}</span>
              </label>
              <input
                className="input-field"
                style={{ width: '100%' }}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('fieldNamePlaceholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('fieldMessage')}</label>
              <textarea
                className="input-field"
                style={{ width: '100%' }}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('fieldMessagePlaceholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('fieldLocation')} <span className="required">{t('required')}</span>
              </label>
              <button type="button" className="gps-btn" onClick={getGPS}>
                {t('gpsButton')}
              </button>
              {gpsStatus && <p className="gps-status">{gpsStatus}</p>}
              <input
                className="input-field"
                style={{ width: '100%', marginTop: '8px' }}
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder={t('fieldLocationPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('fieldPhotos')} <span className="required">{t('required')}</span>
              </label>
              <div className="photo-upload" onClick={() => fileRef.current.click()}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handlePhotos}
                />
                <div className="photo-upload-icon">📷</div>
                <p className="photo-upload-text">{t('photoUploadText')}</p>
              </div>
              {previews.length > 0 && (
                <div className="photo-previews">
                  {previews.map((src, i) => (
                    <img key={i} src={src} className="photo-preview" alt="" />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? t('submitting') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function StonePage() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadStone = async () => {
    try {
      const res = await api.get(`/stones/${number}`);
      setData(res.data);
    } catch (err) {
      setError('Stone not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStone(); }, [number]);

  const handleSuccess = () => {
    setShowForm(false);
    setSuccess(true);
    loadStone();
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="loading">...</div>;
  if (error) return (
    <div className="empty-state">
      <p>Stein #{number} nicht gefunden.</p>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>← Zurück</button>
    </div>
  );

  const { stone, entries } = data;

  return (
    <div className="stone-page">
      <div className="stone-header">
        <div className="stone-number-badge">{number}</div>
        <h1>{t('stoneTitle')} #{number}</h1>
        <p className="stone-subtitle">
          {entries.length} {entries.length === 1 ? t('entry') : t('entries')}
          {' · '}
          <span className={`status-badge status-${stone.status}`}>
            {stone.status === 'active' ? t('active') : t('inactive')}
          </span>
        </p>
      </div>

      {entries.length > 0 && <StoneMap entries={entries} />}

      {success && (
        <div style={{ background: 'var(--sage-muted)', padding: '20px 24px', textAlign: 'center', borderBottom: '1px solid var(--sage-light)' }}>
          <p style={{ color: 'var(--sage-dark)', fontSize: '15px' }}>✓ {t('successMessage')}</p>
        </div>
      )}

      <div className="entries-section">
        <div className="container">
          <h2>{t('stoneHistory')}</h2>
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>{t('stoneFirstEntry')}</p>
            </div>
          ) : (
            entries.map(entry => <EntryCard key={entry.id} entry={entry} />)
          )}

          {!showForm && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                {t('addEntry')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && <AddEntryForm stoneNumber={number} onSuccess={handleSuccess} />}
    </div>
  );
}
