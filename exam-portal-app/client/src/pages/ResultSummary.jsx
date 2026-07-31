import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios';

const SERVER_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function ResultSummary() {
  const { resultId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [certificate, setCertificate] = useState(location.state?.certificate || null);

  useEffect(() => {
    api.get('/results/' + resultId).then(({ data }) => setResult(data));
  }, [resultId]);

  useEffect(() => {
    if (!result || result.status !== 'pass' || certificate) return;
    api.get('/certificates/result/' + resultId)
      .then(({ data }) => setCertificate(data))
      .catch(() => setCertificate(null));
  }, [certificate, result, resultId]);

  if (!result) return <div className="app-page"><div className="empty-state">Loading result...</div></div>;

  return (
    <div className="app-page result-page">
      <section className="result-card">
        <span className={'status-pill ' + result.status}>{result.status.toUpperCase()}</span>
        <h1>Exam Result</h1>
        <div className="score-ring">
          <strong>{result.percentage.toFixed(1)}%</strong>
          <span>{result.score} / {result.totalMarks} marks</span>
        </div>
      {result.status === 'pass' && certificate && (
        <p className="result-actions">
          <a href={SERVER_ROOT + certificate.fileUrl} target="_blank" rel="noreferrer">
            <button>Download Certificate</button>
          </a>
        </p>
      )}
        <Link className="text-link" to="/dashboard">Back to Dashboard</Link>
      </section>
    </div>
  );
}
