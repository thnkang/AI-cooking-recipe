
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileDeckProps {
  userProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const CUISINES = ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian', 'French', 'Korean', 'American', 'Mediterranean'];
const ALLERGENS = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish'];
const DIETARY_OPTIONS = ['Vegetarian', 'Pescatarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

const ProfileDeck: React.FC<ProfileDeckProps> = ({ userProfile, onUpdate }) => {
  const [allergyInput, setAllergyInput] = useState('');

  const toggleList = (key: keyof UserProfile, value: string) => {
    const currentList = userProfile[key] as string[];
    let newList: string[];
    if (currentList.includes(value)) {
      newList = currentList.filter(i => i !== value);
    } else {
      newList = [...currentList, value];
    }
    onUpdate({ ...userProfile, [key]: newList });
  };

  const setSimpleValue = (key: keyof UserProfile, value: string) => {
    onUpdate({ ...userProfile, [key]: value });
  };

  return (
    <div className="p-4 space-y-6 flex flex-col h-full overflow-y-auto pb-24">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">My Kitchen Profile 👤</h2>
        <p className="text-sm text-gray-700 font-medium">Customize your AI Chef experience</p>
      </header>

      {/* Cooking Level */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🍳</span> Cooking Level
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {['Novice', 'Intermediate', 'Expert'].map(level => (
            <button
              key={level}
              onClick={() => setSimpleValue('cookingLevel', level)}
              className={`py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                userProfile.cookingLevel === level
                ? 'bg-soft-pink text-white border-soft-pink shadow-sm'
                : 'bg-gray-50 text-gray-700 border-transparent hover:border-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      {/* Personal Goal */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🎯</span> Personal Goal
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {['Eat Healthy', 'Lose Weight', 'Gain Muscle'].map(goal => (
            <button
              key={goal}
              onClick={() => setSimpleValue('personalGoal', goal)}
              className={`py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                userProfile.personalGoal === goal
                ? 'bg-soft-pink text-white border-soft-pink shadow-sm'
                : 'bg-gray-50 text-gray-700 border-transparent hover:border-gray-200'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </section>

      {/* Cuisines */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🌮</span> Favorite Cuisines
        </h3>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => toggleList('cuisinePreferences', c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                userProfile.cuisinePreferences.includes(c)
                ? 'bg-mint text-white border-mint shadow-sm'
                : 'bg-gray-50 text-gray-600 border-transparent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Dietary Requirements */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🥗</span> Dietary Preferences
        </h3>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => toggleList('dietaryPreferences', d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                userProfile.dietaryPreferences.includes(d)
                ? 'bg-mint text-white border-mint shadow-sm'
                : 'bg-gray-50 text-gray-600 border-transparent'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Allergies */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🥜</span> Allergies & Restrictions
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom allergy..."
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && allergyInput.trim()) {
                toggleList('allergies', allergyInput.trim());
                setAllergyInput('');
              }
            }}
            className="flex-1 bg-gray-50 border-none rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-soft-pink outline-none text-gray-900 placeholder-gray-400"
          />
          <button 
            onClick={() => {
              if (allergyInput.trim()) {
                toggleList('allergies', allergyInput.trim());
                setAllergyInput('');
              }
            }}
            className="bg-red-500 text-white px-4 rounded-xl font-bold text-xs"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map(a => (
            <button
              key={a}
              onClick={() => toggleList('allergies', a)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                userProfile.allergies.includes(a)
                ? 'bg-red-100 text-red-600 border-red-200'
                : 'bg-gray-50 text-gray-600 border-transparent'
              }`}
            >
              {a}
            </button>
          ))}
          {userProfile.allergies.filter(a => !ALLERGENS.includes(a)).map(custom => (
            <div key={custom} className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 flex items-center gap-1">
              {custom}
              <button onClick={() => toggleList('allergies', custom)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Level */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🏃</span> Activity Level
        </h3>
        <select 
          value={userProfile.activityLevel}
          onChange={(e) => setSimpleValue('activityLevel', e.target.value)}
          className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-soft-pink outline-none text-gray-900"
        >
          <option value="Sedentary">Sedentary (Little or no exercise)</option>
          <option value="Light Active">Light Active (Exercise 1-3 days/week)</option>
          <option value="Moderately Active">Moderately Active (Exercise 3-5 days/week)</option>
          <option value="Very Active">Very Active (Hard exercise 6-7 days)</option>
          <option value="Extremely Active">Extremely Active (Physical job & hard training)</option>
        </select>
      </section>
      
      <div className="py-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium italic">Changes are saved automatically ✨</p>
      </div>
    </div>
  );
};

export default ProfileDeck;
