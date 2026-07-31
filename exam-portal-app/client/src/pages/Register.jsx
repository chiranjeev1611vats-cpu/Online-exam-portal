import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(form);
      navigate(user.role === 'student' ? '/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Set up your profile and start learning with confidence.">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        <label>
          <span>Full name</span>
          <input name="name" placeholder="John Smith" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          <span>Account type</span>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </label>
        <button type="submit">Register</button>
        <p className="auth-switch">Have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
