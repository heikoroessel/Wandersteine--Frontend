import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../i18n';

export default function Home() {
  const [number, setNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = parseInt(number);
    if (n >= 1 && n <= 80) {
      navigate(`/stein/${n}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-script">Rieke & Leo</div>
        <h1>Wandersteine</h1>
        <p className="hero-sub">{t('tagline')}</p>
      </div>

      {/* Stone number input */}
      <div className="stone-input-section">
        <p className="section-label">{t('homeLabel')}</p>
        <h2 className="section-title">{t('homeTitle')}</h2>
        <form onSubmit={handleSubmit} className="stone-number-form">
          <input
            className="input-field"
            type="number"
            min="1"
            max="80"
            value={number}
            onChange={e => setNumber(e.target.value)}
            placeholder={t('homePlaceholder')}
            autoFocus
          />
          <button type="submit" className="btn-primary">
            {t('homeButton')}
          </button>
        </form>
      </div>

      {/* Explanation */}
      <div className="explanation">
        <div className="divider" />
        {t('explanation').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <div className="divider" />
        <p style={{ fontSize: '13px', color: 'var(--stone)', letterSpacing: '0.05em' }}>
          18.07.2026 · Weingut Boulter & Koeller
        </p>
      </div>
    </div>
  );
}
