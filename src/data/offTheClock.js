/**
 * =====================================================================
 * OFF THE CLOCK — EDITABLE DATA CONSTANTS
 * =====================================================================
 * All customizable content for the "Off the Clock" section.
 * Photos, captions, tags, and doodle metadata.
 */

// Import 14 real photos directly from assets (strictly from src/assets)
import photo1 from '../assets/1730620583078.jpg';
import photo2 from '../assets/1755012812846.jpg';
import photo3 from '../assets/1755012848551.jpg';
import photo4Internship from '../assets/internship.jpeg';
import photo5 from '../assets/Whats-10-02 at 11.02.25 PM.jpeg';
import photo6 from '../assets/WhatsApp Image 2026-10-02 at 11.02.20 PM.jpeg';
import photo7 from '../assets/WhatsApp Image 2026-10-02 at 11.02.21 PM.jpeg';
import photo8 from '../assets/WhatsApp Image 2026-10-02 at 11.02.22 PM.jpeg';
import photo9 from '../assets/WhatsApp Image 2026-10-02 at 11.02.23 PM.jpeg';
import photo10 from '../assets/WhatsApp Image 2026-10-02 at 11.02.24 PM.jpeg';
import photo11 from '../assets/WhatsApp Image 2026-10-02 at 11.02.25 PM.jpeg';
import photo12 from '../assets/Whatsp Image 2026-10-02 at 11.02.23 PM.jpeg';
import photo13FansShow from '../assets/fans show.jpeg';
import photo14PlusTwo from '../assets/Image 2026-10-02 at 11.02.20 PM.jpeg';

export const sectionHeader = {
  number: '05 / OFF THE CLOCK',
  title: 'Off the clock.',
  subtitle: "The parts of me that don't fit in a résumé.",
  description:
    'A small glimpse into college days, campus afternoons, desk doodles, and late-night moments.'
};

/**
 * Photo Booth items (14 Polaroids in exact requested order).
 * - caption: Short (max 6 words), warm, handwritten.
 * - tag: Mono uppercase.
 * - objectPosition: Position tuned so faces are never cropped.
 * - rotation: Tuned between -3.6 and +3.6 degrees.
 * - tape: 'cream' | 'lime' | 'kraft' | 'none'
 */
export const photos = [
  {
    id: 'photo-1',
    src: photo1,
    alt: 'Classroom seminar during industrial visit',
    caption: 'Learning outside the classroom',
    tag: 'INDUSTRIAL VISIT',
    objectPosition: 'center 10%', // Crops bottom GPS map stamp out
    rotation: -2.8,
    tape: 'lime'
  },
  {
    id: 'photo-2',
    src: photo2,
    alt: 'Coding at hackathon with laptops and teammates',
    caption: 'Sleepless, caffeinated, building',
    tag: 'HACKATHON',
    objectPosition: 'center 62%',
    rotation: 2.2,
    tape: 'kraft'
  },
  {
    id: 'photo-3',
    src: photo3,
    alt: 'Big group photo with college batch',
    caption: 'A useless project. Loved it anyway.',
    tag: 'USELESS PROJECT',
    objectPosition: 'center 40%',
    rotation: -1.8,
    tape: 'cream'
  },
  {
    id: 'photo-4',
    src: photo4Internship,
    alt: 'Muhammed working on laptop during internship at office desk',
    caption: 'Ten days, sixty hours, lots of code',
    tag: 'INTERNSHIP',
    objectPosition: 'center 20%',
    rotation: 2.6,
    tape: 'lime'
  },
  {
    id: 'photo-5',
    src: photo5,
    alt: 'NSS volunteers sitting together in purple vests',
    caption: 'NSS morning, full energy',
    tag: 'NSS',
    objectPosition: 'center 24%',
    rotation: -2.5,
    tape: 'cream'
  },
  {
    id: 'photo-6',
    src: photo6,
    alt: 'Friends in bright green and red raincoats outdoors',
    caption: 'Rain, raincoats, zero regrets',
    tag: 'RAINY OUT',
    objectPosition: 'center 38%',
    rotation: 3.2,
    tape: 'kraft'
  },
  {
    id: 'photo-7',
    src: photo7,
    alt: 'Glowing laptop keyboard in a dark room at night',
    caption: 'Late night, laptop glowing',
    tag: 'LAPTOP',
    objectPosition: 'center center',
    rotation: -1.5,
    tape: 'none'
  },
  {
    id: 'photo-8',
    src: photo8,
    alt: 'School uniform group photo with teacher in corridor',
    caption: 'Where it all started',
    tag: 'SCHOOL',
    objectPosition: 'center 18%',
    rotation: 2.0,
    tape: 'cream'
  },
  {
    id: 'photo-9',
    src: photo9,
    alt: 'Two college friends on the steps with a classmate',
    caption: 'My college people',
    tag: 'COLLEGE',
    objectPosition: 'center 22%',
    rotation: -2.9,
    tape: 'lime'
  },
  {
    id: 'photo-10',
    src: photo10,
    alt: 'Friends having tea by palm trees next to scooter',
    caption: 'A random evening, perfect',
    tag: 'RANDOM EVENING',
    objectPosition: 'center 56%',
    rotation: 2.4,
    tape: 'kraft'
  },
  {
    id: 'photo-11',
    src: photo11,
    alt: 'Two glasses of hot tea on wooden table outdoors',
    caption: 'Tea time, always',
    tag: 'TEA TIME',
    objectPosition: 'center 52%',
    rotation: -2.1,
    tape: 'none'
  },
  {
    id: 'photo-12',
    src: photo12,
    alt: 'Friends in traditional green shirts and white mundu for Onam',
    caption: 'Onam, dressed to impress',
    tag: 'ONAM',
    objectPosition: 'center 64%',
    rotation: 2.8,
    tape: 'cream'
  },
  {
    id: 'photo-13',
    src: photo13FansShow,
    alt: 'Friends wearing Argentina football jerseys celebrating outdoors on matchday',
    caption: 'Argentina jerseys, pure matchday energy',
    tag: 'FANS SHOW',
    objectPosition: 'center 42%',
    rotation: -2.2,
    tape: 'lime'
  },
  {
    id: 'photo-14',
    src: photo14PlusTwo,
    alt: 'Whole batch Plus Two school uniform group photo',
    caption: 'Plus Two, the whole gang',
    tag: 'PLUS TWO',
    objectPosition: 'center 42%',
    rotation: 1.8,
    tape: 'cream'
  }
];

/**
 * Doodle section metadata
 */
export const doodleHeader = {
  title: "Things I draw when code doesn't work.",
  subtitle: 'Rough margin sketches and notebook notes when debugging gets stubborn.'
};
