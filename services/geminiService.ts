
import { GoogleGenAI } from "@google/genai";
import { UserProfile, TimePreference } from "../types";

const PANTRY_STAPLES = [
  "Salt", "Black Pepper", "Cooking Oil (Olive/Vegetable)", "Sugar", 
  "Butter", "Water", "Garlic Powder", "Onion Powder", "Dried Herbs"
];

export const generateRecipe = async (
  profile: UserProfile,
  ingredients: string[],
  allowShopping: boolean,
  timePreference: TimePreference
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const shoppingInstruction = allowShopping 
    ? "IMPORTANT: Since shopping is allowed, you MUST first identify 2-3 essential items to buy. Start your response with exactly '## Shopping List' followed by a bulleted list of these items. Then proceed to the recipe title."
    : "IMPORTANT: Shopping is NOT allowed. Use ONLY the provided ingredients. DO NOT include a shopping list.";

  const prompt = `
    Act as a professional chef and nutritionist.
    
    USER PROFILE:
    - Skill Level: ${profile.cookingLevel}
    - Goal: ${profile.personalGoal}
    - Preferred Cuisines: ${profile.cuisinePreferences.join(', ') || 'Global/Any'}
    - Diet: ${profile.dietaryPreferences.join(', ') || 'No specific diet'}
    - Allergies: ${profile.allergies.join(', ') || 'None'}
    
    CURRENT REQUEST:
    - Ingredients Available: ${ingredients.join(', ')}
    - Pantry Staples: ${PANTRY_STAPLES.join(', ')}
    - Shopping Allowed: ${allowShopping ? 'Yes' : 'No'}
    - Time Preference: ${timePreference}
    
    TASK:
    Generate a delicious recipe that fits the user's profile.
    
    REQUIRED STRUCTURE (STRICT):
    1. ${allowShopping ? "## Shopping List (then a few items)\n\n" : ""}
    2. # [RECIPE TITLE WITH EMOJI]
    3. **Why this fits your goal:** [1 sentence]
    4. **Estimated Time:** [Prep + Cook time]
    5. ### Ingredients
    6. ### Instructions
    7. ### Chef's Tip

    IMPORTANT: Ensure the Recipe Title (# [Title]) is clearly present as a top-level heading.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I couldn't generate a recipe.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error generating recipe.");
  }
};

export const generateRecipeImage = async (
  title: string, 
  ingredients: string, 
  instructions: string
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Use strictly trimmed strings to prevent prompt bloat for long recipes
  const visualIngredients = ingredients.split('\n').slice(0, 5).join(', ');
  const visualMethod = instructions.split('\n').slice(0, 3).join('. ');

  const prompt = `
    Professional macro food photography of: "${title}".
    Plated dish containing: ${visualIngredients.substring(0, 150)}.
    Preparation style: ${visualMethod.substring(0, 150)}.
    Style: Appetizing, fresh, gourmet cookbook style, soft bokeh, high resolution.
    Strictly NO text, NO paper, NO labels, NO people, NO shopping lists.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
