import React from 'react';
import { useApp } from '../store';
import { Card, Badge } from './RetroUI';

export const Ranking = () => {
  const { users } = useApp();
  
  // Sort users by points desc
  const sortedUsers = [...users]
    .filter(u => u.role !== 'ADMIN') // Hide admin from ranking
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-brazil-yellow text-center mb-4 bg-brazil-blue border-2 border-black inline-block px-4 py-1 pixel-shadow-sm -rotate-1">
        🏆 RANKING OFICIAL
      </h2>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-200 border-b-4 border-black text-xl">
                    <th className="p-4 border-r-2 border-black w-16 text-center">#</th>
                    <th className="p-4 border-r-2 border-black">JOGADOR</th>
                    <th className="p-4 text-center">PONTOS</th>
                </tr>
            </thead>
            <tbody>
                {sortedUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b-2 border-gray-300 text-lg font-bold ${index === 0 ? 'bg-yellow-100 text-brazil-green' : 'bg-white'}`}>
                        <td className="p-4 border-r-2 border-gray-300 text-center">
                            {index + 1}º
                        </td>
                        <td className="p-4 border-r-2 border-gray-300">
                           {user.name} 
                           {index === 0 && <span className="ml-2">👑</span>}
                        </td>
                        <td className="p-4 text-center text-2xl">
                            {user.points}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </Card>

      <Card className="bg-gray-100">
          <h3 className="font-bold text-lg mb-2 underline">REGRAS DE PONTUAÇÃO:</h3>
          <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-green-600">3 PONTOS:</strong> Acertou o placar EXATO (Ex: Apostou 2x1 e foi 2x1).</li>
              <li><strong className="text-blue-600">1 PONTO:</strong> Acertou o vencedor ou empate, mas errou o placar.</li>
              <li><strong className="text-red-500">0 PONTOS:</strong> Errou tudo.</li>
          </ul>
      </Card>
    </div>
  );
};