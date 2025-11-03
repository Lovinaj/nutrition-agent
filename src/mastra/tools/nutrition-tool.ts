import axios from 'axios';
import { z } from 'zod';

// USDA API Configuration
const USDA_API_KEY = process.env.USDA_API_KEY!;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// --- Types ---
interface FoodItem {
  fdcId: number;
  description: string;
}

interface SearchResults {
  foods: FoodItem[];
}

interface Nutrient {
  nutrient: { name: string };
  amount: number;
}

interface FoodDetails {
  description: string;
  foodNutrients: Nutrient[];
}

// --- Helper Functions ---
async function searchFood(query: string, pageSize: number = 5): Promise<SearchResults> {
  try {
    const response = await axios.get<SearchResults>(`${USDA_BASE_URL}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query: query,
        pageSize: pageSize,
        dataType: 'Foundation,SR Legacy'
      }
    });
    return response.data;
  } catch (error) {
    console.error('USDA API Error:', error);
    throw new Error('Failed to search food database');
  }
}

async function getFoodDetails(fdcId: number): Promise<FoodDetails> {
  try {
    const response = await axios.get<FoodDetails>(`${USDA_BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: USDA_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('USDA API Error:', error);
    throw new Error('Failed to get food details');
  }
}

function formatNutritionInfo(foodData: FoodDetails): string {
  const nutrients = foodData.foodNutrients || [];
  
  const keyNutrients: Record<string, string> = {
    'Energy': 'kcal',
    'Protein': 'g',
    'Total lipid (fat)': 'g',
    'Carbohydrate, by difference': 'g',
    'Fiber, total dietary': 'g',
    'Sugars, total including NLEA': 'g',
    'Calcium, Ca': 'mg',
    'Iron, Fe': 'mg',
    'Sodium, Na': 'mg',
    'Vitamin C, total ascorbic acid': 'mg',
    'Vitamin A, IU': 'IU'
  };

  let nutritionText = `**${foodData.description}**\n\n`;
  nutritionText += `**Per 100g serving:**\n`;

  for (const [nutrientName, unit] of Object.entries(keyNutrients)) {
    const nutrient = nutrients.find((n) => n.nutrient?.name === nutrientName);
    
    if (nutrient) {
      const amount = nutrient.amount?.toFixed(2) || 'N/A';
      nutritionText += `- ${nutrientName}: ${amount} ${unit}\n`;
    }
  }

  return nutritionText;
}

// --- Tool: Search Food (With Zod Schema) ---
export const searchFoodTool = {
  id: 'searchFood',
  description: 'Search for food items in the USDA database and get nutrition facts',
  inputSchema: z.object({
    foodName: z.string().describe('The name of the food to search for (e.g., "apple", "chicken breast raw")')
  }),
  execute: async ({ context }: { context: { foodName: string } }) => {
    try {
      console.log('🔍 Searching for food:', context.foodName);
      const results = await searchFood(context.foodName);

      console.log('📊 Search results:', results.foods?.length || 0, 'foods found');

      if (!results.foods || results.foods.length === 0) {
        const message = `No nutrition data found for "${context.foodName}". Try being more specific (e.g., "chicken breast raw", "black beans cooked").`;
        console.log('❌', message);
        return { text: message };
      }

      const topFood = results.foods[0];
      console.log('✅ Top match:', topFood.description);
      
      const details = await getFoodDetails(topFood.fdcId);
      const formattedInfo = formatNutritionInfo(details);

      return { text: formattedInfo };
    } catch (error: any) {
      console.error('Tool error:', error.message);
      return { 
        text: `Unable to fetch nutrition data: ${error.message}. Please try again.` 
      };
    }
  }
};

// --- Tool: Compare Foods (With Zod Schema) ---
export const compareFoodsTool = {
  id: 'compareFoods',
  description: 'Compare nutrition facts between two different foods',
  inputSchema: z.object({
    food1: z.string().describe('First food to compare'),
    food2: z.string().describe('Second food to compare')
  }),
  execute: async ({ context }: { context: { food1: string; food2: string } }) => {
    try {
      console.log('⚖️  Comparing:', context.food1, 'vs', context.food2);
      
      const [results1, results2] = await Promise.all([
        searchFood(context.food1, 1),
        searchFood(context.food2, 1)
      ]);

      if (!results1.foods?.length || !results2.foods?.length) {
        const message = 'Could not find one or both foods for comparison. Please try more specific names.';
        console.log('❌', message);
        return { text: message };
      }

      console.log('✅ Found:', results1.foods[0].description, '&', results2.foods[0].description);

      const [details1, details2] = await Promise.all([
        getFoodDetails(results1.foods[0].fdcId),
        getFoodDetails(results2.foods[0].fdcId)
      ]);

      const comparison = `**Nutrition Comparison:**\n\n` +
        formatNutritionInfo(details1) + '\n\n' +
        formatNutritionInfo(details2);

      return { text: comparison };
    } catch (error: any) {
      console.error('❌ Comparison error:', error.message);
      return { 
        text: `Unable to compare foods: ${error.message}. Please try again.` 
      };
    }
  }
};