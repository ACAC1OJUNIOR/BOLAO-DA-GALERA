import { Match, User, UserRole } from "./types";

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'FABIO', password: '123', role: UserRole.USER, points: 0 },
  { id: 'u2', name: 'DINA', password: '123', role: UserRole.USER, points: 0 },
  { id: 'u3', name: 'JUNIOR', password: '123', role: UserRole.USER, points: 0 },
  { id: 'u4', name: 'RONALDO', password: '123', role: UserRole.USER, points: 0 },
  { id: 'admin', name: 'ADM', password: '1234', role: UserRole.ADMIN, points: 0 },
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    teamA: 'Brasil',
    teamB: 'Argentina',
    flagA: 'bra',
    flagB: 'arg',
    date: '19/06 - 21:00',
    location: 'Mangueirão, Belém',
    scoreA: null,
    scoreB: null,
    status: 'SCHEDULED',
    isSpecial: true
  },
  {
    id: 'm2',
    teamA: 'França',
    teamB: 'Alemanha',
    flagA: 'fra',
    flagB: 'ger',
    date: '20/06 - 15:00',
    location: 'Copa 2026 - Grupo A',
    scoreA: null,
    scoreB: null,
    status: 'SCHEDULED'
  },
  {
    id: 'm3',
    teamA: 'Espanha',
    teamB: 'Itália',
    flagA: 'esp',
    flagB: 'ita',
    date: '21/06 - 18:00',
    location: 'Copa 2026 - Grupo B',
    scoreA: null,
    scoreB: null,
    status: 'SCHEDULED'
  },
  {
    id: 'm4',
    teamA: 'EUA',
    teamB: 'México',
    flagA: 'usa',
    flagB: 'mex',
    date: '22/06 - 12:00',
    location: 'Copa 2026 - Grupo C',
    scoreA: null,
    scoreB: null,
    status: 'SCHEDULED'
  }
];