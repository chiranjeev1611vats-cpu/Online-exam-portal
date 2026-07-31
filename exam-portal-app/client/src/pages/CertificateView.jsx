import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const SERVER_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function CertificateView() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);

  useEffect(() => {
    api.get('/certificates/' + certId).then(({ data }) => setCert(data));
  }, [certId]);

  if (!cert) return <div className="app-page"><div className="empty-state">Loading certificate...</div></div>;

  return (
    <div className="app-page">
      <section className="certificate-panel">
        <span className="eyebrow">Achievement unlocked</span>
        <h1>Certificate</h1>
        <p>Certificate ID: <strong>{cert.certificateId}</strong></p>
        <p>Issued: {new Date(cert.issueDate).toDateString()}</p>
      <a href={SERVER_ROOT + cert.fileUrl} target="_blank" rel="noreferrer">
        <button>Download PDF</button>
      </a>
      </section>
    </div>
  );
}
