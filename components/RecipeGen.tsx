
import React, { useState } from 'react';
import { UserProfile, TimePreference } from '../types';
import { generateRecipe, generateRecipeImage } from '../services/geminiService';

interface RecipeGenProps {
  inventory: string[];
  userProfile: UserProfile;
}

const RecipeGen: React.FC<RecipeGenProps> = ({ inventory, userProfile }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [allowShopping, setAllowShopping] = useState(false);
  const [timePreference, setTimePreference] = useState<TimePreference>(TimePreference.QUICK);
  const [recipe, setRecipe] = useState('');
  const [recipeImageUrl, setRecipeImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [error, setError] = useState('');

  const toggleIngredient = (item: string) => {
    const newSet = new Set(selectedIngredients);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setSelectedIngredients(newSet);
  };

  const handleGenerate = async () => {
    if (selectedIngredients.size === 0) {
      setError('Please pick some ingredients first!');
      return;
    }
    setError('');
    setIsLoading(true);
    setIsVisualizing(false);
    setRecipe('');
    setRecipeImageUrl(null);

    try {
      const result = await generateRecipe(
        userProfile,
        Array.from(selectedIngredients),
        allowShopping,
        timePreference
      );
      setRecipe(result);
      
      // Start visualization state immediately after text is ready
      setIsVisualizing(true);

      // --- ROBUST PARSING FOR IMAGE GENERATION ---
      // 1. Try to find the first line starting with #
      const titleMatch = result.match(/^# (.*$)/m) || result.match(/# (.*)/);
      const title = titleMatch ? titleMatch[1].trim() : "Delicious Meal";
      
      // 2. Extract Ingredients and Instructions sections safely
      const ingredientsMatch = result.match(/### Ingredients([\s\S]*?)(###|$)/i);
      const instructionsMatch = result.match(/### Instructions([\s\S]*?)(###|$)/i);
      
      const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : "";
      const instructionsText = instructionsMatch ? instructionsMatch[1].trim() : "";

      // Fire off image generation
      const imageUrl = await generateRecipeImage(
        title,
        ingredientsText,
        instructionsText
      );
      setRecipeImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setIsVisualizing(false);
    }
  };

  const renderRecipe = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (!line) {
        elements.push(<div key={`empty-${i}`} className="h-2" />);
        i++;
        continue;
      }

      if (line.startsWith('## Shopping List')) {
        const shoppingItems: string[] = [];
        i++; 
        while (i < lines.length) {
          const nextLine = lines[i]?.trim();
          if (!nextLine) { i++; if (i >= lines.length) break; continue; }
          if (nextLine.startsWith('- ') || nextLine.startsWith('* ')) {
            shoppingItems.push(nextLine.replace(/^[-*]\s+/, ''));
            i++;
          } else if (nextLine.startsWith('#') || nextLine.startsWith('###') || nextLine.startsWith('**') || /^\d+\./.test(nextLine)) {
            break;
          } else {
            shoppingItems.push(nextLine);
            i++;
          }
        }
        elements.push(
          <div key={`shopping-list-${i}`} className="mb-6 overflow-hidden rounded-2xl border-2 border-amber-100 bg-amber-50 shadow-sm">
            <div className="p-4 bg-amber-100/50 border-b border-amber-100">
              <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Shopping List
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {shoppingItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-amber-900 font-bold">
                  <span className="text-amber-500 text-xl leading-none mt-0.5">•</span>
                  <span className="flex-1">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`title-${i}`} className="text-2xl font-bold text-soft-pink mb-4 mt-2 leading-tight">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`section-${i}`} className="text-xl font-bold mt-6 mb-3 text-gray-900 border-b border-gray-100 pb-1">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (/^\d+\./.test(line)) {
        elements.push(
          <div key={`step-${i}`} className="ml-1 mb-4 text-gray-800 flex gap-3">
            <span className="font-bold text-soft-pink min-w-[24px] h-6 flex items-center justify-center bg-pink-50 rounded-full text-xs">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span className="flex-1 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`bullet-${i}`} className="ml-5 list-disc text-gray-800 font-medium mb-1.5 marker:text-soft-pink leading-relaxed">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      } else {
        const parts = line.split('**');
        elements.push(
          <p key={`p-${i}`} className="mb-3 text-gray-800 leading-relaxed">
            {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="text-gray-900 font-bold">{part}</strong> : part)}
          </p>
        );
      }
      i++;
    }
    return elements;
  };

  return (
    <div className="h-full overflow-y-auto px-4 pt-4 pb-32">
      <div className="space-y-6 max-w-full">
        <header className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">Chef's Table 👩‍🍳</h2>
          
          <div className="flex flex-wrap justify-center gap-1.5 px-2">
            <div className="px-2.5 py-1 bg-pink-100 text-soft-pink text-[10px] font-bold rounded-full border border-pink-200 uppercase tracking-tighter">
              Level: {userProfile.cookingLevel}
            </div>
            <div className="px-2.5 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full border border-blue-200 uppercase tracking-tighter">
              Goal: {userProfile.personalGoal}
            </div>
            {userProfile.cuisinePreferences.length > 0 && (
              <div className="px-2.5 py-1 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full border border-teal-200 uppercase tracking-tighter">
                {userProfile.cuisinePreferences[0]} {userProfile.cuisinePreferences.length > 1 ? `+${userProfile.cuisinePreferences.length - 1}` : ''}
              </div>
            )}
            {userProfile.dietaryPreferences.length > 0 && (
              <div className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200 uppercase tracking-tighter">
                Diet: {userProfile.dietaryPreferences[0]}
              </div>
            )}
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-800">Pick Ingredients:</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
               <span>🧂</span>
               <span>Pantry Staples Included</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {inventory.map(item => (
              <button
                key={item}
                onClick={() => toggleIngredient(item)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                  selectedIngredients.has(item)
                  ? 'bg-soft-pink text-white border-soft-pink shadow-md scale-105'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-soft-pink/30 shadow-sm'
                }`}
              >
                {item}
              </button>
            ))}
            {inventory.length === 0 && (
               <p className="text-gray-600 text-sm italic font-medium px-1">Add items to your fridge first!</p>
            )}
          </div>
        </section>

        <section className="bg-white p-5 rounded-3xl shadow-md space-y-5 border border-gray-100">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">Allow Shopping?</span>
              <span className="text-[10px] text-gray-500">Suggest items to buy if needed</span>
            </div>
            <button 
              onClick={() => setAllowShopping(!allowShopping)}
              className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${allowShopping ? 'bg-mint' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${allowShopping ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
            {[TimePreference.QUICK, TimePreference.LONG].map(time => (
              <button
                key={time}
                onClick={() => setTimePreference(time)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  timePreference === time 
                  ? 'bg-mint text-white shadow-md scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {time === TimePreference.QUICK ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {time}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center animate-bounce">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-soft-pink text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
               Personalizing Recipe...
             </span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Generate Recipe
            </>
          )}
        </button>

        {recipe && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-pink-50 animate-in slide-in-from-bottom-6 duration-700 overflow-hidden">
            <div className="relative h-64 w-full group overflow-hidden bg-gray-100">
              {recipeImageUrl ? (
                <>
                  <img 
                    src={recipeImageUrl} 
                    alt="Finished Dish" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                      Chef's Vision Preview
                    </span>
                  </div>
                </>
              ) : isVisualizing ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-soft-pink border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Visualizing your masterpiece...</span>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-300 text-xs font-bold uppercase">No Preview Available</span>
                </div>
              )}
            </div>
            
            <div className="p-6 text-gray-800">
              {renderRecipe(recipe)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGen;
