import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../hooks/Auth/useAuth';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import InputErrorMessage from '../../common/InputErrorMessage/InputErrorMessage';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading: isLoginLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password }).unwrap();
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-dark p-0">
      <div>
        <Input
          id="login-email"
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
          labelClasses="text-[#b6c2cf]"
        />
      </div>
      <div>
        <Input
          id="login-password"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-[#22272b] border-[#2c3e50] text-white focus:border-[#2684ff] focus:ring-[#2684ff]"
          labelClasses="text-[#b6c2cf]"
        />
      </div>
      {error && <InputErrorMessage error={error} />}
      <Button
        type="submit"
        size="large"
        variant="primary"
        disabled={isLoginLoading}
        className="bg-[#2684ff] hover:bg-[#0052cc] text-white font-semibold rounded transition-colors duration-200 py-2 px-4 mt-2 shadow-sm"
      >
        {isLoginLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
