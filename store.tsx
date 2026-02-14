import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Match, Bet, UserRole } from './types';
import { INITIAL_USERS, INITIAL_MATCHES } from './constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  bets: Bet[];
  login: (name: string, pass: string) => boolean;
  logout: () => void;
  placeBet: (matchId: string, scoreA: number, scoreB: number) => void;
  updateMatchResult: (matchId: string, scoreA: number, scoreB: number) => void;
  toggleMatchLock: (matchId: string) => void;
  resetSystem: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or init defaults
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('bg_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [bets, setBets] = useState<Bet[]>(() => {
    const saved = localStorage.getItem('bg_bets');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence effects
  useEffect(() => localStorage.setItem('bg_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('bg_matches', JSON.stringify(matches)), [matches]);
  useEffect(() => localStorage.setItem('bg_bets', JSON.stringify(bets)), [bets]);

  // Recalculate ranking whenever matches or bets change
  useEffect(() => {
    const newUsers = users.map(user => {
      let points = 0;
      
      bets.filter(b => b.userId === user.id).forEach(bet => {
        const match = matches.find(m => m.id === bet.matchId);
        if (match && match.status === 'FINISHED' && match.scoreA !== null && match.scoreB !== null) {
          // Rule 1: Exact Score (3 pts)
          if (bet.scoreA === match.scoreA && bet.scoreB === match.scoreB) {
            points += 3;
          } 
          // Rule 2: Correct Result (Winner/Draw) (1 pt)
          else {
            const betDiff = bet.scoreA - bet.scoreB;
            const matchDiff = match.scoreA - match.scoreB;
            
            // Check if both are draws OR both are Team A wins OR both are Team B wins
            if (
              (betDiff === 0 && matchDiff === 0) || 
              (betDiff > 0 && matchDiff > 0) ||
              (betDiff < 0 && matchDiff < 0)
            ) {
              points += 1;
            }
          }
        }
      });
      return { ...user, points };
    });

    // Only update state if points actually changed to avoid loop
    const hasChanged = JSON.stringify(newUsers) !== JSON.stringify(users);
    if (hasChanged) {
        setUsers(newUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, bets]);


  const login = (name: string, pass: string): boolean => {
    const user = users.find(u => u.name.toUpperCase() === name.toUpperCase() && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const placeBet = (matchId: string, scoreA: number, scoreB: number) => {
    if (!currentUser) return;
    setBets(prev => {
      const existing = prev.filter(b => !(b.userId === currentUser.id && b.matchId === matchId));
      return [...existing, { userId: currentUser.id, matchId, scoreA, scoreB }];
    });
  };

  const updateMatchResult = (matchId: string, scoreA: number, scoreB: number) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId ? { ...m, scoreA, scoreB, status: 'FINISHED' } : m
    ));
  };

  const toggleMatchLock = (matchId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      if (m.status === 'SCHEDULED') return { ...m, status: 'LOCKED' };
      if (m.status === 'LOCKED') return { ...m, status: 'SCHEDULED' };
      return m;
    }));
  };

  const resetSystem = () => {
    if (window.confirm("ATENÇÃO: Isso apagará todos os resultados e voltará o status inicial. Continuar?")) {
      setMatches(INITIAL_MATCHES);
      // Bets are kept, but points will recalculate to 0 because matches are reset
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, users, matches, bets, 
      login, logout, placeBet, updateMatchResult, toggleMatchLock, resetSystem 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};