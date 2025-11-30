'use client';

import { useStore } from '../../store/useStore';
import { useRouter } from 'next/navigation';

const starterHabits = [
  "Drink 2L water", "Meditate 10 min", "Read 20 pages", "10k steps",
  "No social media before noon", "Sleep 8h", "Journal", "Gratitude list",
  "Cold shower", "Stretch 10 min", "No sugar", "Call family/friend",
  "Code/learn 1h", "Floss", "Make bed", "5 min breathing", "Push-ups",
  "Walk in nature", "No phone in bed", "Write 3 things I'm proud of"
];

export default function Onboarding() {
  const { saveHabits } = useStore();
  const router = useRouter();

  const addAll = async () => {
    const newHabits = starterHabits.map(name => ({
      id: crypto.randomUUID(),
      name,
      frequency: 'daily' as const,
    }));
    await saveHabits(newHabits);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Let's get you started!
        </h1>
        <p className="text-xl mb-12 text-gray-700">Here are 20 of the most powerful habits people love</p>
        <button
          onClick={addAll}
          className="px-16 py-8 text-4xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl hover:scale-110 transition"
        >
          Add All 20 → Start Today!
        </button>
        <p className="mt-8 text-gray-500">You can delete or edit any later</p>
      </div>
    </div>
  );
}
