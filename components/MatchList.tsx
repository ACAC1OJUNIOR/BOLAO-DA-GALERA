import React, { useState } from 'react';
import { useApp } from '../store';
import { Card, Button, Badge, PixelFlag } from './RetroUI';
import { UserRole, Match } from '../types';

export const MatchList = () => {
  const { matches, currentUser, bets, placeBet, updateMatchResult, toggleMatchLock } = useApp();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brazil-blue text-center mb-4 bg-white border-2 border-black inline-block px-4 py-1 pixel-shadow-sm rotate-1">
        JOGOS & PALPITES
      </h2>

      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          userRole={currentUser?.role || UserRole.USER}
          existingBet={bets.find(b => b.userId === currentUser?.id && b.matchId === match.id)}
          onBet={placeBet}
          onResult={updateMatchResult}
          onToggleLock={toggleMatchLock}
        />
      ))}
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  userRole: UserRole;
  existingBet?: { scoreA: number, scoreB: number };
  onBet: (id: string, sA: number, sB: number) => void;
  onResult: (id: string, sA: number, sB: number) => void;
  onToggleLock: (id: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, userRole, existingBet, onBet, onResult, onToggleLock }) => {
  // Initialize with '0' using nullish coalescing so 0 stays 0, but undefined/null becomes '0'
  const [betA, setBetA] = useState<string>(existingBet?.scoreA.toString() ?? '0');
  const [betB, setBetB] = useState<string>(existingBet?.scoreB.toString() ?? '0');
  
  // Admin State - Initialize with '0'
  const [resA, setResA] = useState<string>(match.scoreA?.toString() ?? '0');
  const [resB, setResB] = useState<string>(match.scoreB?.toString() ?? '0');

  const isAdmin = userRole === UserRole.ADMIN;
  
  // Users are locked if status is LOCKED or FINISHED
  // Admin is never "locked" from editing result, but needs visual cues
  const isLocked = (match.status === 'FINISHED' || match.status === 'LOCKED') && !isAdmin;

  // New Rule: Admin can only edit result if match is NOT Scheduled (must be Locked or Finished)
  const canAdminEditResult = match.status !== 'SCHEDULED';

  const handleBetSave = () => {
    const valA = betA === '' ? 0 : parseInt(betA);
    const valB = betB === '' ? 0 : parseInt(betB);
    onBet(match.id, valA, valB);
    alert('PALPITE SALVO COM SUCESSO!');
  };

  const handleResultSave = () => {
    const valA = resA === '' ? 0 : parseInt(resA);
    const valB = resB === '' ? 0 : parseInt(resB);
    onResult(match.id, valA, valB);
    alert('PLACAR ATUALIZADO!');
  };

  // Helper to enforce limits
  const handleScoreChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value === '') {
        setter('');
        return;
    }
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 20) {
        setter(value);
    }
  };

  // Enforce "Cannot be empty" on blur
  const handleBlur = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value === '') {
        setter('0');
    }
  };

  return (
    <Card isSpecial={match.isSpecial} className="relative">
      {match.isSpecial && (
        <div className="absolute -top-3 -right-3">
          <Badge color="yellow">★ EVENTO ESPECIAL ★</Badge>
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-600 border-b-2 border-gray-200 pb-2 mb-4 font-bold uppercase">
        <span>{match.date}</span>
        <span>{match.location}</span>
      </div>

      <div className="flex items-center justify-between gap-2 md:gap-8">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center">
          <PixelFlag code={match.flagA} name={match.teamA} />
          <span className="font-bold text-xl uppercase text-center mt-2">{match.teamA}</span>
        </div>

        {/* Scores Area */}
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
                {isAdmin ? (
                    // ADMIN CONTROLS
                    <>
                        <input 
                            type="number" 
                            min="0"
                            max="20"
                            className={`w-16 h-16 text-center text-3xl font-bold border-4 border-brazil-blue ${!canAdminEditResult ? 'bg-gray-200 text-gray-400' : 'bg-white'}`}
                            value={resA}
                            onChange={(e) => handleScoreChange(e.target.value, setResA)}
                            onBlur={() => handleBlur(resA, setResA)}
                            disabled={!canAdminEditResult}
                            title={!canAdminEditResult ? "Bloqueie as apostas para editar" : ""}
                        />
                        <span className="text-2xl font-bold">X</span>
                        <input 
                            type="number" 
                            min="0"
                            max="20"
                            className={`w-16 h-16 text-center text-3xl font-bold border-4 border-brazil-blue ${!canAdminEditResult ? 'bg-gray-200 text-gray-400' : 'bg-white'}`}
                            value={resB}
                            onChange={(e) => handleScoreChange(e.target.value, setResB)}
                            onBlur={() => handleBlur(resB, setResB)}
                            disabled={!canAdminEditResult}
                            title={!canAdminEditResult ? "Bloqueie as apostas para editar" : ""}
                        />
                    </>
                ) : (
                    // USER CONTROLS
                    <>
                        <input 
                            type="number" 
                            min="0"
                            max="20"
                            className={`w-16 h-16 text-center text-3xl font-bold border-4 border-black ${isLocked ? 'bg-gray-300' : 'bg-yellow-50'}`}
                            value={match.status === 'FINISHED' ? (match.scoreA ?? 0) : betA}
                            onChange={(e) => handleScoreChange(e.target.value, setBetA)}
                            onBlur={() => handleBlur(betA, setBetA)}
                            disabled={isLocked}
                        />
                        <span className="text-2xl font-bold">X</span>
                        <input 
                            type="number" 
                            min="0"
                            max="20"
                            className={`w-16 h-16 text-center text-3xl font-bold border-4 border-black ${isLocked ? 'bg-gray-300' : 'bg-yellow-50'}`}
                            value={match.status === 'FINISHED' ? (match.scoreB ?? 0) : betB}
                            onChange={(e) => handleScoreChange(e.target.value, setBetB)}
                            onBlur={() => handleBlur(betB, setBetB)}
                            disabled={isLocked}
                        />
                    </>
                )}
            </div>
            
            <div className="mt-2">
                {match.status === 'FINISHED' ? (
                     <Badge color="green">ENCERRADO</Badge>
                ) : match.status === 'LOCKED' ? (
                    <Badge color="red">APOSTAS FECHADAS</Badge>
                ) : (
                    <Badge color="blue">ABERTO</Badge>
                )}
            </div>
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center">
          <PixelFlag code={match.flagB} name={match.teamB} />
          <span className="font-bold text-xl uppercase text-center mt-2">{match.teamB}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 text-center">
        {isAdmin ? (
            <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex gap-4">
                    {match.status !== 'FINISHED' && (
                        <Button 
                            variant={match.status === 'LOCKED' ? 'primary' : 'danger'} 
                            onClick={() => onToggleLock(match.id)}
                            className="text-sm"
                        >
                            {match.status === 'LOCKED' ? '🔓 REABRIR APOSTAS' : '🔒 BLOQUEAR APOSTAS'}
                        </Button>
                    )}
                    <Button 
                        variant="secondary" 
                        onClick={handleResultSave}
                        disabled={!canAdminEditResult}
                        className="text-sm"
                    >
                        LANÇAR RESULTADO
                    </Button>
                </div>
                {!canAdminEditResult && (
                    <span className="text-xs text-red-600 font-bold">⚠️ BLOQUEIE AS APOSTAS PARA LANÇAR O RESULTADO</span>
                )}
            </div>
        ) : (
             !isLocked && <Button variant="primary" onClick={handleBetSave}>{existingBet ? 'ATUALIZAR PALPITE' : 'ENVIAR PALPITE'}</Button>
        )}
        
        {!isAdmin && existingBet && !isLocked && (
            <div className="mt-2 text-sm text-green-700 font-bold">✓ SEU PALPITE: {existingBet.scoreA} x {existingBet.scoreB}</div>
        )}
        {!isAdmin && isLocked && existingBet && (
            <div className="mt-2 text-sm text-gray-600 font-bold">SEU PALPITE: {existingBet.scoreA} x {existingBet.scoreB}</div>
        )}
      </div>
    </Card>
  );
};