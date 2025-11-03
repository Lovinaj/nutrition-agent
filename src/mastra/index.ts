import { Mastra } from '@mastra/core';
import { nutritionAgent } from './agents/nutrition-agent';

// Create Mastra instance with your agent
export const mastra = new Mastra({
  bundler: {
    externals: ['axios']
  },
  agents: {
    nutritionAgent,
  },
});
