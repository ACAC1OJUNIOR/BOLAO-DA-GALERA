export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  password?: string; // stored for mock auth
  role: UserRole;
  points: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string; // FIFA Code (e.g., 'bra')
  flagB: string; // FIFA Code (e.g., 'arg')
  date: string;
  location: string;
  scoreA: number | null;
  scoreB: number | null;
  status: 'SCHEDULED' | 'FINISHED' | 'LOCKED';
  isSpecial?: boolean;
}

export interface Bet {
  userId: string;
  matchId: string;
  scoreA: number;
  scoreB: number;
  pointsEarned?: number;
}