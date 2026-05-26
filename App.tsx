
import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Inventory from './components/Inventory';
import RecipeGen from './components/RecipeGen';
import ProfileDeck from './components/ProfileDeck';

const App: React.FC = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'cook' | 'profile'>('inventory');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Load existing profile if available
    const saved = localStorage.getItem('kitchen_buddy_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
        setOnboardingComplete(true);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    setIsInitializing(false);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setOnboardingComplete(true);
    localStorage.setItem('kitchen_buddy_profile', JSON.stringify(profile));
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('kitchen_buddy_profile', JSON.stringify(updatedProfile));
  };

  const addItems = (newItems: string[]) => {
    setInventory(prev => {
      const filtered = newItems.filter(item => !prev.includes(item));
      return [...prev, ...filtered];
    });
  };

  const removeItem = (item: string) => {
    setInventory(prev => prev.filter(i => i !== item));
  };

  // Initializing state
  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5] font-bold text-soft-pink">Loading...</div>;
  }

  // 1단계: 온보딩 확인
  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 2단계: 메인 앱 화면
  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 overflow-hidden shadow-2xl relative">
      <main className="flex-1 overflow-hidden">
        {activeTab === 'inventory' && (
          <Inventory 
            inventory={inventory} 
            onAddItems={addItems} 
            onRemoveItem={removeItem} 
          />
        )}
        {activeTab === 'cook' && userProfile && (
          <RecipeGen 
            inventory={inventory} 
            userProfile={userProfile} 
          />
        )}
        {activeTab === 'profile' && userProfile && (
          <ProfileDeck 
            userProfile={userProfile} 
            onUpdate={updateProfile} 
          />
        )}
      </main>

      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around p-3 pb-6 safe-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'inventory' ? 'text-soft-pink scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] font-bold">Fridge</span>
        </button>
        <button 
          onClick={() => setActiveTab('cook')}
          className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'cook' ? 'text-soft-pink scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-bold">Cook!</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'profile' ? 'text-soft-pink scale-110' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
