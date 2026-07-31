import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'student' ? '/dashboard' : '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your exam journey.">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
        <label>
          <span>Email address</span>
          <input type="email" placeholder="admin@examportal.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <div className="form-row">
          <label className="check-label">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#forgot">Forgot password?</a>
        </div>
        <button type="submit">Sign in</button>
        <p className="auth-switch">Are you new? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}
