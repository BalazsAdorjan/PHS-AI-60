import { Session } from '../types';
import { initialSessions } from '../data/sessions';

// In-memory store — simulates a backend database
let sessions: Session[] = initialSessions.map((s) => ({ ...s }));

// Simulate async network latency
const delay = (ms = 80) => new Promise((res) => setTimeout(res, ms));

export async function getSessions(): Promise<Session[]> {
  await delay();
  return sessions.map((s) => ({ ...s }));
}

export async function registerUser(
  sessionId: string,
  userId: string
): Promise<Session> {
  await delay();
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  if (session.registeredUsers.includes(userId)) {
    throw new Error('Already registered');
  }

  if (session.registeredUsers.length >= session.capacity) {
    // Add to waitlist instead
    if (!session.waitlist.includes(userId)) {
      session.waitlist = [...session.waitlist, userId];
    }
  } else {
    session.registeredUsers = [...session.registeredUsers, userId];
  }

  return { ...session };
}

export async function unregisterUser(
  sessionId: string,
  userId: string
): Promise<Session> {
  await delay();
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const wasRegistered = session.registeredUsers.includes(userId);
  const wasWaitlisted = session.waitlist.includes(userId);

  if (!wasRegistered && !wasWaitlisted) {
    throw new Error('Not registered');
  }

  if (wasRegistered) {
    session.registeredUsers = session.registeredUsers.filter(
      (id) => id !== userId
    );
    // Promote first person from waitlist
    if (session.waitlist.length > 0) {
      const [next, ...rest] = session.waitlist;
      session.registeredUsers = [...session.registeredUsers, next];
      session.waitlist = rest;
    }
  } else {
    session.waitlist = session.waitlist.filter((id) => id !== userId);
  }

  return { ...session };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await delay();
  sessions = sessions.filter((s) => s.id !== sessionId);
}

export async function addSession(session: Omit<Session, 'id' | 'registeredUsers' | 'waitlist'>): Promise<Session> {
  await delay();
  const newSession: Session = {
    ...session,
    id: `session-${Date.now()}`,
    registeredUsers: [],
    waitlist: [],
  };
  sessions = [...sessions, newSession];
  return { ...newSession };
}
