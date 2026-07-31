import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Timer from '../components/Timer';

export default function ExamRunner() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const startedAtRef = useRef(new Date().toISOString());
  const submittedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/exams/' + examId).then(({ data }) => setExam(data));
  }, [examId]);

  const selectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const payload = {
      examId,
      startedAt: startedAtRef.current,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption })),
    };
    const { data } = await api.post('/results/submit', payload);
    navigate('/result/' + data.result._id, { state: { certificate: data.certificate } });
  };

  if (!exam) return <div className="app-page"><div className="empty-state">Loading exam...</div></div>;
  if (!exam.questions || exam.questions.length === 0) return <div className="app-page"><div className="empty-state">This exam has no questions yet.</div></div>;

  const question = exam.questions[current];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(((current + 1) / exam.questions.length) * 100);

  return (
    <div className="app-page exam-page">
      <header className="exam-header">
        <div>
          <p>Question {current + 1} of {exam.questions.length}</p>
          <h1>{exam.title}</h1>
        </div>
        <Timer durationMinutes={exam.durationMinutes} onExpire={handleSubmit} />
      </header>
      <div className="progress-bar" aria-hidden="true">
        <span style={{ width: progress + '%' }} />
      </div>

      <div className="exam-layout">
        <aside className="question-rail">
          <p>Answered</p>
          <strong>{answeredCount}/{exam.questions.length}</strong>
          <div className="question-dots">
            {exam.questions.map((q, idx) => (
              <button
                key={q._id}
                type="button"
                className={(idx === current ? 'active ' : '') + (answers[q._id] !== undefined ? 'answered' : '')}
                onClick={() => setCurrent(idx)}
                aria-label={'Go to question ' + (idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </aside>

        <section className="exam-runner">
          <span className="eyebrow">Question {current + 1}</span>
          <h2>{question.questionText}</h2>
        <div className="options">
          {question.options.map((opt, idx) => (
            <label key={idx} className="option">
              <input
                type="radio"
                name={question._id}
                checked={answers[question._id] === idx}
                onChange={() => selectOption(question._id, idx)}
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
        <div className="nav-buttons">
          <button className="button-secondary" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</button>
          {current < exam.questions.length - 1 ? (
            <button onClick={() => setCurrent((c) => c + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit Exam</button>
          )}
        </div>
        </section>
      </div>
    </div>
  );
}
