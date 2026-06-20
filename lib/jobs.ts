import { CategoryId } from '@/lib/categories';

export type JobId =
  | 'spring-clean'
  | 'home-reno'
  | 'backyard-party'
  | 'camping-trip'
  | 'music-events'
  | 'get-moving'
  | 'host-a-show';

export type Job = {
  id: JobId;
  label: string;
  emoji: string;
  tagline: string;
  categories: CategoryId[];
};

export const JOBS: Job[] = [
  {
    id: 'spring-clean',
    label: 'Spring clean',
    emoji: '🧹',
    tagline: 'Pressure washers, ladders, carpet cleaners. Get it done in a weekend.',
    categories: ['tools'],
  },
  {
    id: 'home-reno',
    label: 'Home reno',
    emoji: '🔨',
    tagline: 'Pro-grade saws, drills, and tile tools. Skip the hardware store.',
    categories: ['tools'],
  },
  {
    id: 'backyard-party',
    label: 'Backyard party',
    emoji: '🎉',
    tagline: 'PA systems, chairs, tables, generators. Host up to 150 people.',
    categories: ['party'],
  },
  {
    id: 'camping-trip',
    label: 'Camping trip',
    emoji: '⛺',
    tagline: 'Tents, kayaks, canoes, and camp kitchens. Ontario is outside.',
    categories: ['camping'],
  },
  {
    id: 'music-events',
    label: 'Music & events',
    emoji: '🎸',
    tagline: 'Guitars, pianos, drum kits, DJ rigs. Record, rehearse, or perform.',
    categories: ['instruments', 'electronics'],
  },
  {
    id: 'get-moving',
    label: 'Get moving',
    emoji: '🚴',
    tagline: 'E-bikes, paddleboards, snowboards, road bikes. Move without buying.',
    categories: ['sports'],
  },
  {
    id: 'host-a-show',
    label: 'Host a show',
    emoji: '🎬',
    tagline: 'Projectors, DJ rigs, photo booths. Make the night worth talking about.',
    categories: ['electronics', 'party'],
  },
];

export function getJobById(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
