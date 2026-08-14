import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { confirmAccount } from '../services/api';

const Confirm = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Confirming your account...');
  const navigate = useNavigate();

  useEffect(() => {
    async function confirm() {
      try {
        const response = await confirmAccount(token);
        setMessage(response.data.message || 'Account confirmed.');
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Confirmation failed.');
      }
    }
    confirm();
  }, [token, navigate]);

  return (
    <>
      <PageHeader title="Confirmation" subtitle="Confirming your account now." />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-slate-700 text-lg">{message}</p>
        </div>
      </section>
    </>
  );
};

export default Confirm;
