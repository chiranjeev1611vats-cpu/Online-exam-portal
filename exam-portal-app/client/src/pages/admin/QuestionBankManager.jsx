import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import AppHeader from '../../components/AppHeader';

const emptyForm = {
  questionText: '',
  marks: 1,
  difficulty: 'medium',
  options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }],
};

const getBankName = (question) => question.tags?.[0] || 'General';

export default function QuestionBankManager() {
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [activeBank, setActiveBank] = useState('all');
  const [bankName, setBankName] = useState('General');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadQuestions = () => api.get('/questions').then(({ data }) => setQuestions(data));
  const loadExams = () => api.get('/exams').then(({ data }) => setExams(data));

  useEffect(() => { loadQuestions(); loadExams(); }, []);

  const banks = useMemo(() => {
    const summary = questions.reduce((acc, question) => {
      const name = getBankName(question);
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(summary).map(([name, count]) => ({ name, count }));
  }, [questions]);

  const visibleQuestions = activeBank === 'all'
    ? questions
    : questions.filter((question) => getBankName(question) === activeBank);

  const resetForm = () => {
    setForm(emptyForm);
    setBankName(activeBank === 'all' ? 'General' : activeBank);
    setSelectedExam('');
    setEditingId('');
  };

  const updateOption = (idx, field, value) => {
    const options = form.options.map((o) => ({ ...o }));
    if (field === 'isCorrect') {
      options.forEach((o, i) => { o.isCorrect = i === idx; });
    } else {
      options[idx][field] = value;
    }
    setForm({ ...form, options });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, { text: '', isCorrect: false }] });

  const startEdit = (question) => {
    setEditingId(question._id);
    setBankName(getBankName(question));
    setSelectedExam('');
    setForm({
      questionText: question.questionText,
      marks: question.marks,
      difficulty: question.difficulty,
      options: question.options?.length ? question.options : emptyForm.options,
    });
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Delete this question from the bank?')) return;
    await api.delete('/questions/' + questionId);
    if (editingId === questionId) resetForm();
    loadQuestions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: bankName.trim() ? [bankName.trim()] : ['General'],
    };

    if (editingId) {
      await api.put('/questions/' + editingId, payload);
      if (selectedExam) {
        await api.patch('/exams/' + selectedExam + '/questions', { questionId: editingId });
      }
    } else {
      const { data: question } = await api.post('/questions', payload);
      if (selectedExam) {
        await api.patch('/exams/' + selectedExam + '/questions', { questionId: question._id });
      }
    }

    resetForm();
    loadQuestions();
  };

  return (
    <div className="app-page">
      <AppHeader title="Question Bank" subtitle="Navigate sets, edit questions and attach them to exams" />

      <section className="bank-workspace">
        <aside className="bank-sidebar">
          <div className="table-panel-header">
            <div>
              <p>Banks</p>
              <h2>{banks.length || 1} sets</h2>
            </div>
          </div>
          <button
            type="button"
            className={'bank-nav-item ' + (activeBank === 'all' ? 'active' : '')}
            onClick={() => setActiveBank('all')}
          >
            <span>All Questions</span>
            <strong>{questions.length}</strong>
          </button>
          {banks.map((bank) => (
            <button
              type="button"
              key={bank.name}
              className={'bank-nav-item ' + (activeBank === bank.name ? 'active' : '')}
              onClick={() => {
                setActiveBank(bank.name);
                if (!editingId) setBankName(bank.name);
              }}
            >
              <span>{bank.name}</span>
              <strong>{bank.count}</strong>
            </button>
          ))}
        </aside>

        <section className="table-panel bank-question-panel">
          <div className="table-panel-header">
            <div>
              <p>{activeBank === 'all' ? 'Question library' : activeBank}</p>
              <h2>{visibleQuestions.length} questions</h2>
            </div>
            <button type="button" className="button-secondary" onClick={resetForm}>New Question</button>
          </div>
          <ul className="question-list">
            {visibleQuestions.map((q) => (
              <li key={q._id} className={editingId === q._id ? 'selected' : ''}>
                <span>{q.questionText}</span>
                <div className="question-row-meta">
                  <small>{getBankName(q)}</small>
                  <strong>{q.marks} marks</strong>
                  <em>{q.difficulty}</em>
                  <button type="button" className="button-secondary" onClick={() => startEdit(q)}>Edit</button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(q._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
          {visibleQuestions.length === 0 && <div className="empty-state table-empty">No questions in this bank yet.</div>}
        </section>

        <form onSubmit={handleSubmit} className="question-form manager-form bank-editor">
          <div className="form-title">
            <span className="eyebrow">{editingId ? 'Edit question' : 'New question'}</span>
            <h2>{editingId ? 'Update MCQ' : 'Build MCQ'}</h2>
          </div>
          <input
            placeholder="Bank / set name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
          <input
            placeholder="Question text"
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
            required
          />
          <div className="option-stack">
            {form.options.map((opt, idx) => (
              <div key={idx} className="option-row">
                <input
                  placeholder={'Option ' + (idx + 1)}
                  value={opt.text}
                  onChange={(e) => updateOption(idx, 'text', e.target.value)}
                  required
                />
                <label>
                  <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => updateOption(idx, 'isCorrect', true)} />
                  Correct
                </label>
              </div>
            ))}
          </div>
          <button type="button" className="button-secondary" onClick={addOption}>+ Add Option</button>
          <div className="form-grid">
            <input
              type="number"
              placeholder="Marks"
              value={form.marks}
              onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
            />
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
            <option value="">Attach to exam (optional)</option>
            {exams.map((ex) => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
          </select>
          <div className="form-actions">
            {editingId && <button type="button" className="button-secondary" onClick={resetForm}>Cancel</button>}
            <button type="submit">{editingId ? 'Save Changes' : 'Save Question'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
