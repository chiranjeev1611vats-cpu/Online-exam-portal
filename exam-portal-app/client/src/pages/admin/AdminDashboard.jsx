import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';

export default function AdminDashboard() {
  const { user } = useAuth();

  const modules = [
    {
      title: 'Exam Studio',
      description: 'Create assessments, tune marks and publish tests when they are ready.',
      action: 'Manage Exams',
      to: '/admin/exams',
      icon: 'EX',
    },
    {
      title: 'Question Bank',
      description: 'Build reusable MCQs, set difficulty and attach questions to exams.',
      action: 'Open Bank',
      to: '/admin/questions',
      icon: 'QB',
    },
  ];

  return (
    <div className="app-page">
      <AppHeader title={'Welcome, ' + user.name} subtitle={user.role + ' control panel'} />

      <section className="hero-panel admin-hero">
        <div>
          <span className="eyebrow">Admin workspace</span>
          <h2>Run exams, organize questions and keep the portal moving.</h2>
          <p>Use these tools to prepare assessments before students see them in their dashboard.</p>
        </div>
        <div className="hero-stat">
          <strong>2</strong>
          <span>Management areas</span>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p>Quick access</p>
          <h2>Panel Tools</h2>
        </div>
      </section>

      <div className="admin-tool-grid">
        {modules.map((module) => (
          <article className="card admin-tool-card" key={module.title}>
            <div className="card-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <Link to={module.to}>
              <button>{module.action}</button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
