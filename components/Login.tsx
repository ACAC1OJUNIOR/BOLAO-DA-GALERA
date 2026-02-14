import React, { useState } from 'react';
import { useApp } from '../store';
import { Button, Card } from './RetroUI';

export const Login = () => {
  const { login, users } = useApp();
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(name, pass)) {
      setError('');
    } else {
      setError('USUÁRIO OU SENHA INVÁLIDOS!');
    }
  };

  return (
    <div className="min-h-screen bg-brazil-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-brazil-yellow bg-white relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brazil-blue text-white px-4 py-1 border-2 border-black font-bold text-2xl pixel-shadow-sm">
          BOLÃO DA GALERA
        </div>

        <div className="mt-8 mb-6">
          <div className="text-6xl mb-2 animate-bounce">⚽</div>
          <p className="text-brazil-blue font-bold text-lg">DEMO ACADÊMICA v1.0</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="block font-bold mb-1">JOGADOR:</label>
            <select 
              className="w-full border-2 border-black p-2 bg-gray-100 text-xl font-mono focus:bg-yellow-50 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              <option value="">SELECIONE SEU PERFIL...</option>
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className="block font-bold mb-1">SENHA:</label>
            <input 
              type="password"
              className="w-full border-2 border-black p-2 bg-gray-100 text-xl font-mono focus:bg-yellow-50 outline-none"
              placeholder="***"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {error && <div className="bg-red-500 text-white p-2 border-2 border-black font-bold blink">{error}</div>}

          <Button variant="primary" className="mt-2 text-2xl">ENTRAR NO JOGO</Button>
        </form>

        <div className="mt-8 text-sm text-gray-500 border-t-2 border-gray-300 pt-4">
           <p>SENHA PADRÃO: 123</p>
           <p>SENHA ADM: 1234</p>
        </div>
      </Card>
    </div>
  );
};