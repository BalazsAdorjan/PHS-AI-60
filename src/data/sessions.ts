import { Session } from '../types';

export const initialSessions: Session[] = [
  {
    id: 'session-1',
    title: 'Opening Keynote: 60 Years of POI & The AI Frontier',
    description:
      'A celebration of 60 years of POI achievements and a forward-looking keynote on how AI is reshaping the industry landscape.',
    room: 'Main Hall A',
    timeslot: '09:00 – 10:00',
    capacity: 200,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-2',
    title: 'AI in Practice: Real-World Use Cases',
    description:
      'Hands-on demonstrations and case studies from teams that have successfully integrated AI into their workflows.',
    room: 'Room B1',
    timeslot: '10:15 – 11:15',
    capacity: 60,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-3',
    title: 'Ethics & Governance in AI Systems',
    description:
      'An interactive discussion on building responsible AI: bias, fairness, transparency, and regulatory compliance.',
    room: 'Room C2',
    timeslot: '10:15 – 11:15',
    capacity: 40,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-4',
    title: 'LLMs & Prompt Engineering Workshop',
    description:
      'A deep dive into large language models: how they work, how to prompt them effectively, and what their limits are.',
    room: 'Workshop Lab 1',
    timeslot: '11:30 – 13:00',
    capacity: 30,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-5',
    title: 'Machine Learning for Non-Engineers',
    description:
      'Demystifying ML concepts for product managers, designers, and business stakeholders. No coding required.',
    room: 'Room B2',
    timeslot: '11:30 – 13:00',
    capacity: 50,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-6',
    title: 'Panel: AI Strategy for Leadership',
    description:
      'Senior leaders discuss how to build an AI roadmap, manage change, and measure ROI from AI initiatives.',
    room: 'Main Hall A',
    timeslot: '14:00 – 15:00',
    capacity: 200,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-7',
    title: 'AI-Powered Developer Tools',
    description:
      'Explore Copilot, code generation, automated testing, and other AI tools transforming software development.',
    room: 'Room C1',
    timeslot: '15:15 – 16:15',
    capacity: 45,
    registeredUsers: [],
    waitlist: [],
  },
  {
    id: 'session-8',
    title: 'Closing Ceremony & Networking',
    description:
      'Wrap-up of the event, awards, and open networking session to close 60 years of POI in style.',
    room: 'Main Hall A',
    timeslot: '16:30 – 17:30',
    capacity: 200,
    registeredUsers: [],
    waitlist: [],
  },
];
