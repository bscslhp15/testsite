import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, type, files, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'file' ? files?.[0] : value }));
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password
      });
      const token = response.data.confirmationToken;
      navigate(`/confirm/${token}`);
    } catch (err) {
      setError(err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <>
      <PageHeader title="Register" subtitle="Create a new account and complete your author profile." />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
          <p className="mt-2 text-sm text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link></p>
          {error && <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 lg:grid-cols-2">
            <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="First Name *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Last Name *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <input name="username" value={form.username} onChange={handleChange} type="text" placeholder="Username *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password *" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500" required />
            <div className="lg:col-span-2">
              <button type="submit" className="w-full rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600">Register</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
