import React, { useState } from 'react';
import { AppProvider, useApp } from './store';
import { Login } from './components/Login';
import { MatchList } from './components/MatchList';
import { Ranking } from './components/Ranking';
import { UserRole } from './types';

const MainContent = () => {
  const { currentUser, logout, resetSystem } = useApp();
  const [view, setView] = useState<'MATCHES' | 'RANKING'>('MATCHES');

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-200 pb-12">
      {/* HEADER */}
      <header className="bg-brazil-yellow border-b-4 border-black p-4 mb-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-brazil-blue text-white w-10 h-10 flex items-center justify-center font-bold border-2 border-white rounded-full">
                    {currentUser.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold leading-none text-brazil-blue">BOLÃO DA GALERA</h1>
                    <p className="text-xs font-bold uppercase text-green-700">Olá, {currentUser.name}</p>
                </div>
            </div>
            
            <button 
                onClick={logout} 
                className="text-red-600 font-bold border-2 border-transparent hover:border-red-600 px-2 uppercase"
            >
                Sair
            </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex gap-4">
        <button 
            onClick={() => setView('MATCHES')}
            className={`flex-1 py-3 text-xl font-bold border-4 border-black pixel-shadow transition-transform ${view === 'MATCHES' ? 'bg-brazil-blue text-white translate-y-1 shadow-none' : 'bg-white hover:bg-gray-50'}`}
        >
            ⚽ JOGOS
        </button>
        <button 
            onClick={() => setView('RANKING')}
            className={`flex-1 py-3 text-xl font-bold border-4 border-black pixel-shadow transition-transform ${view === 'RANKING' ? 'bg-brazil-blue text-white translate-y-1 shadow-none' : 'bg-white hover:bg-gray-50'}`}
        >
            🏆 RANKING
        </button>
      </div>

      {/* MAIN AREA */}
      <main className="max-w-4xl mx-auto px-4">
        {view === 'MATCHES' ? <MatchList /> : <Ranking />}

        {/* ADMIN FOOTER ACTIONS */}
        {currentUser.role === UserRole.ADMIN && (
            <div className="mt-12 border-t-4 border-gray-400 pt-8 text-center">
                <h3 className="font-bold text-gray-500 mb-4">ÁREA RESTRITA - ADMINISTRAÇÃO</h3>
                <button 
                    onClick={resetSystem}
                    className="bg-red-600 text-white font-bold py-2 px-6 border-2 border-black hover:bg-red-700 pixel-shadow-sm"
                >
                    ⚠️ RESETAR TODOS OS PLACARES
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}