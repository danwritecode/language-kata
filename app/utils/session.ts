import type { Session } from '~/types/session';

const SESSIONS_LIST_KEY = 'nihongo-sessions-list';
const SESSION_KEY_PREFIX = 'nihongo-session-';
const MAX_SESSIONS = 20;
const MAX_AGE_DAYS = 60;

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateSessionName(subject: string): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${subject || 'Mixed'} - ${date}`;
}

export function saveSession(session: Session): void {
  if (typeof window === 'undefined') return;
  
  // Save the session
  localStorage.setItem(`${SESSION_KEY_PREFIX}${session.id}`, JSON.stringify(session));
  
  // Update sessions list
  const sessionsList = getSessionsList();
  if (!sessionsList.includes(session.id)) {
    sessionsList.unshift(session.id);
    
    // Limit number of sessions
    if (sessionsList.length > MAX_SESSIONS) {
      const removedIds = sessionsList.splice(MAX_SESSIONS);
      removedIds.forEach(id => {
        localStorage.removeItem(`${SESSION_KEY_PREFIX}${id}`);
      });
    }
    
    localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessionsList));
  }
  
  // Clean up old sessions
  cleanupOldSessions();
}

export function getSession(sessionId: string): Session | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(`${SESSION_KEY_PREFIX}${sessionId}`);
  return sessionData ? JSON.parse(sessionData) : null;
}

export function getAllSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  
  const sessionsList = getSessionsList();
  const sessions: Session[] = [];
  
  sessionsList.forEach(id => {
    const session = getSession(id);
    if (session) {
      sessions.push(session);
    }
  });
  
  // Sort by last updated (newest first)
  return sessions.sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
}

export function deleteSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  
  // Remove session data
  localStorage.removeItem(`${SESSION_KEY_PREFIX}${sessionId}`);
  
  // Update sessions list
  const sessionsList = getSessionsList();
  const index = sessionsList.indexOf(sessionId);
  if (index > -1) {
    sessionsList.splice(index, 1);
    localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessionsList));
  }
}

function getSessionsList(): string[] {
  if (typeof window === 'undefined') return [];
  
  const list = localStorage.getItem(SESSIONS_LIST_KEY);
  return list ? JSON.parse(list) : [];
}

function cleanupOldSessions(): void {
  const sessionsList = getSessionsList();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - MAX_AGE_DAYS);
  
  const validSessions: string[] = [];
  
  sessionsList.forEach(id => {
    const session = getSession(id);
    if (session && new Date(session.lastUpdated) > cutoffDate) {
      validSessions.push(id);
    } else {
      localStorage.removeItem(`${SESSION_KEY_PREFIX}${id}`);
    }
  });
  
  if (validSessions.length !== sessionsList.length) {
    localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(validSessions));
  }
}