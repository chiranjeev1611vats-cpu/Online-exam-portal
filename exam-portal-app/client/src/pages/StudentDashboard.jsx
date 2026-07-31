import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/exams').then(({ data }) => setExams(data));
  }, []);

  return (
    <div className="app-page">
      <AppHeader title={'Welcome, ' + user.name} subtitle="Student dashboard" />

      <section className="hero-panel student-hero">
        <div>
          <span className="eyebrow">Ready to test yourself</span>
          <h2>Pick an exam and keep your progress moving.</h2>
          <p>Published assessments appear here with duration and marks so you can choose the right session.</p>
        </div>
        <div className="hero-stat">
          <strong>{exams.length}</strong>
          <span>Available exams</span>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p>Exam library</p>
          <h2>Available Exams</h2>
        </div>
      </section>

      <div className="card-list exam-grid">
        {exams.map((exam) => (
          <article key={exam._id} className="card exam-card">
            <div className="card-icon">EX</div>
            <h3>{exam.title}</h3>
            <p>{exam.description || 'No description added yet.'}</p>
            <div className="exam-meta">
              <span>{exam.durationMinutes} min</span>
              <span>{exam.totalMarks} marks</span>
              <span>{exam.questions?.length ?? 0} questions</span>
            </div>
            <Link to={'/exam/' + exam._id}>
              <button>Start Exam</button>
            </Link>
          </article>
        ))}
        {exams.length === 0 && <div className="empty-state">No exams available right now.</div>}
      </div>
    </div>
  );
}
