import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AppHeader from '../../components/AppHeader';

export default function ExamManager() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', durationMinutes: 30, totalMarks: 10, passingMarks: 4 });

  const load = () => api.get('/exams').then(({ data }) => setExams(data));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/exams', {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      totalMarks: Number(form.totalMarks),
      passingMarks: Number(form.passingMarks),
    });
    setForm({ title: '', description: '', durationMinutes: 30, totalMarks: 10, passingMarks: 4 });
    load();
  };

  const togglePublish = async (id) => {
    await api.patch('/exams/' + id + '/publish');
    load();
  };

  return (
    <div className="app-page">
      <AppHeader title="Manage Exams" subtitle="Create, review and publish assessments" />

      <section className="manager-layout">
        <form onSubmit={handleCreate} className="inline-form manager-form">
          <div className="form-title">
            <span className="eyebrow">New exam</span>
            <h2>Create assessment</h2>
          </div>
          <label className="field-label">
            <span>Exam title</span>
            <input name="title" placeholder="Example: Chemistry Final Test" value={form.title} onChange={handleChange} required />
          </label>
          <label className="field-label">
            <span>Description</span>
            <input name="description" placeholder="Short note for faculty/student reference" value={form.description} onChange={handleChange} />
          </label>
          <div className="form-grid">
            <label className="field-label">
              <span>Duration</span>
              <input name="durationMinutes" type="number" min="1" value={form.durationMinutes} onChange={handleChange} required />
              <small>Time limit in minutes.</small>
            </label>
            <label className="field-label">
              <span>Total marks</span>
              <input name="totalMarks" type="number" min="1" value={form.totalMarks} onChange={handleChange} required />
              <small>Maximum marks for this exam.</small>
            </label>
          </div>
          <label className="field-label">
            <span>Passing marks</span>
            <input name="passingMarks" type="number" min="0" value={form.passingMarks} onChange={handleChange} required />
            <small>Minimum marks a student needs to pass.</small>
          </label>
          <button type="submit">Create Exam</button>
        </form>

        <section className="table-panel">
          <div className="table-panel-header">
            <div>
              <p>Exam library</p>
              <h2>{exams.length} exams</h2>
            </div>
          </div>
          <table className="table">
            <thead><tr><th>Title</th><th>Duration</th><th>Status</th><th>Questions</th><th>Actions</th></tr></thead>
            <tbody>
              {exams.map((ex) => (
                <tr key={ex._id}>
                  <td><strong>{ex.title}</strong></td>
                  <td>{ex.durationMinutes} min</td>
                  <td><span className={'status-pill ' + ex.status}>{ex.status}</span></td>
                  <td>{ex.questions?.length ?? 0}</td>
                  <td>
                    <button className="button-secondary" onClick={() => togglePublish(ex._id)}>
                      {ex.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && <div className="empty-state table-empty">No exams created yet.</div>}
          <p className="helper-text">
            Add questions to an exam from the Question Bank page - pick the exam in the dropdown when creating a question.
          </p>
        </section>
      </section>
    </div>
  );
}
