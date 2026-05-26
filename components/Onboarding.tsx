
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const CUISINES = ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian', 'French', 'Korean', 'American', 'Mediterranean'];
const ALLERGENS = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish'];
const DIETARY_OPTIONS = ['Vegetarian', 'Pescatarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    cookingLevel: 'Intermediate',
    cuisinePreferences: [],
    allergies: [],
    personalGoal: 'Eat Healthy',
    activityLevel: 'Moderately Active',
    dietaryPreferences: [],
  });

  const [allergyInput, setAllergyInput] = useState('');

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else onComplete(profile);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleList = (key: keyof UserProfile, value: string) => {
    setProfile(prev => {
      const currentList = prev[key] as string[];
      if (currentList.includes(value)) {
        return { ...prev, [key]: currentList.filter(i => i !== value) };
      } else {
        return { ...prev, [key]: [...currentList, value] };
      }
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">What's your cooking level? 🍳</h2>
            <div className="space-y-3">
              {[
                { label: 'Novice', desc: "Never cooked / Beginner" },
                { label: 'Intermediate', desc: "Cook sometimes / Comfortable" },
                { label: 'Expert', desc: "Pro chef / Cook all the time" }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setProfile({ ...profile, cookingLevel: opt.label })}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    profile.cookingLevel === opt.label 
                    ? 'border-soft-pink bg-pink-50' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="font-bold text-gray-900">{opt.label}</div>
                  <div className={`text-sm ${profile.cookingLevel === opt.label ? 'text-gray-700' : 'text-gray-600'}`}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Favorite Cuisines? 🌮</h2>
            <p className="text-center text-gray-700 font-medium text-sm">Select all that apply</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CUISINES.map(c => (
                <button
                  key={c}
                  onClick={() => toggleList('cuisinePreferences', c)}
                  className={`px-4 py-2 rounded-full border-2 transition-all font-bold ${
                    profile.cuisinePreferences.includes(c)
                    ? 'bg-soft-pink text-white border-soft-pink'
                    : 'bg-white text-gray-800 border-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Any Allergies? 🥜</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search food (e.g. Strawberries)..."
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && allergyInput) {
                    toggleList('allergies', allergyInput);
                    setAllergyInput('');
                  }
                }}
                className="flex-1 p-3 rounded-full border-2 border-gray-100 shadow-inner bg-white focus:ring-2 focus:ring-soft-pink outline-none text-gray-900 font-medium placeholder-gray-500"
              />
              <button 
                onClick={() => {
                   if (allergyInput) { toggleList('allergies', allergyInput); setAllergyInput(''); }
                }}
                className="bg-mint text-white px-6 rounded-full font-bold shadow-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {ALLERGENS.map(a => (
                <button
                  key={a}
                  onClick={() => toggleList('allergies', a)}
                  className={`px-4 py-2 rounded-full border-2 transition-all font-bold ${
                    profile.allergies.includes(a)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-800 border-gray-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">What is your main goal? 🎯</h2>
            <div className="space-y-3">
              {[
                { label: 'Eat Healthy', desc: "Balance and nutrition" },
                { label: 'Lose Weight', desc: "Calorie deficit" },
                { label: 'Gain Muscle', desc: "High protein" }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setProfile({ ...profile, personalGoal: opt.label })}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    profile.personalGoal === opt.label 
                    ? 'border-soft-pink bg-pink-50' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="font-bold text-gray-900">{opt.label}</div>
                  <div className={`text-sm ${profile.personalGoal === opt.label ? 'text-gray-700' : 'text-gray-600'}`}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Activity Level? 🏃</h2>
            <div className="space-y-3 overflow-y-auto max-h-[40vh] p-1">
              {[
                { label: 'Sedentary', desc: "Little or no exercise" },
                { label: 'Light Active', desc: "Exercise 1-3 days/week" },
                { label: 'Moderately Active', desc: "Exercise 3-5 days/week" },
                { label: 'Very Active', desc: "Hard exercise 6-7 days" },
                { label: 'Extremely Active', desc: "Physical job & hard training" }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setProfile({ ...profile, activityLevel: opt.label })}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    profile.activityLevel === opt.label 
                    ? 'border-soft-pink bg-pink-50' 
                    : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="font-bold text-gray-900">{opt.label}</div>
                  <div className={`text-sm ${profile.activityLevel === opt.label ? 'text-gray-700' : 'text-gray-600'}`}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Dietary Requirements? 🥗</h2>
            <p className="text-center text-gray-700 font-medium text-sm">Select all that apply</p>
            <div className="flex flex-wrap justify-center gap-2">
              {DIETARY_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => toggleList('dietaryPreferences', d)}
                  className={`px-4 py-2 rounded-full border-2 transition-all font-bold ${
                    profile.dietaryPreferences.includes(d)
                    ? 'bg-mint text-white border-mint'
                    : 'bg-white text-gray-800 border-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        {step > 0 && (
          <button onClick={prevStep} className="text-gray-700 hover:text-black p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="flex-1 text-center font-bold text-gray-700">Step {step + 1} of 6</h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <div className="flex-1">
        {renderStep()}
      </div>

      <div className="mt-8 space-y-6">
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-soft-pink h-full transition-all duration-300" 
            style={{ width: `${((step + 1) / 6) * 100}%` }} 
          />
        </div>
        <button
          onClick={nextStep}
          className="w-full py-4 bg-soft-pink text-white rounded-2xl font-bold shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {step === 5 ? "Let's Cook!" : "Next"}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
