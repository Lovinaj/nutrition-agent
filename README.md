# 🥗 Nutrition AI Agent for Telex.im

An intelligent nutrition assistant that provides accurate nutritional information using the USDA FoodData Central API, integrated with Telex.im messaging platform via Mastra framework.

## Features

- 🔍 **Food Lookup**: Get detailed nutrition facts for any food item
- ⚖️ **Food Comparison**: Compare nutritional values between two foods
- 📊 **USDA Data**: Real, accurate data from USDA FoodData Central database
- 💬 **Natural Conversation**: Ask questions naturally via Telex.im
- 🤖 **AI-Powered**: Uses Google Gemini 1.5 Pro for intelligent responses
- 🎯 **Key Nutrients**: Calories, protein, fats, carbs, vitamins, minerals

## Tech Stack

- **AI Framework**: Mastra
- **LLM**: Google Gemini 1.5 Pro
- **Runtime**: Node.js + TypeScript
- **External API**: USDA FoodData Central
- **Integration**: Telex.im (A2A Protocol)
- **Deployment**: Mastra Cloud

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Google Gemini API Key
- USDA FoodData Central API Key
- Telex.im account

## Project Structure

```
nutrition-agent/
├── src/
│   └── mastra/
│       ├── index.ts              # Main Mastra configuration
│       └── agents/
│           └── nutrition.ts      # Nutrition agent with USDA tools
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── workflow.json                 # Telex.im integration config
└── README.md                     # This file
```

## Getting Started

### Step 1: Get Your API Keys

#### Google Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

#### USDA API Key (Free)
1. Visit: https://fdc.nal.usda.gov/api-key-signup.html
2. Fill in your details (Name, Email, Organization)
3. Check your email for the API key
4. Copy the key

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nutrition-agent.git
cd nutrition-agent

# Install dependencies
npm install

# Install Mastra CLI globally (if not already installed)
npm install -g @mastra/cli
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key
GOOGLE_API_KEY=your_actual_gemini_api_key_here

# USDA FoodData Central API Key
USDA_API_KEY=your_actual_usda_api_key_here
```

**⚠️ IMPORTANT:** Never commit your `.env` file to GitHub!

### Step 4: Run Locally

```bash
# Start development server
npm run dev
```

You should see:
```
✓ Mastra dev server running at http://localhost:4111

Available agents:
  - nutritionAgent

API Routes:
  GET  /health
  GET  /api/agents
  POST /api/agents/nutritionAgent/generate
```

## Testing with Postman

### Health Check
```
Method: GET
URL: http://localhost:4111/health
```

### Get Nutrition Info
```
Method: POST
URL: http://localhost:4111/api/agents/nutritionAgent/generate

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "messages": [
    "What's the nutrition info for salmon?"
  ]
}
```

**Expected Response:**
```json
{
  "text": "**Salmon, Atlantic, farmed, raw**\n\nPer 100g serving:\n- Energy: 206.00 kcal\n- Protein: 20.42 g\n- Total lipid (fat): 13.42 g\n...",
  "toolCalls": [...]
}
```

### Compare Foods
```
Method: POST
URL: http://localhost:4111/api/agents/nutritionAgent/generate

Body:
{
  "messages": [
    "Compare brown rice and white rice"
  ]
}
```

### Test Different Queries
```json
// Specific nutrient query
{
  "messages": ["How much protein is in chicken breast?"]
}

// Multiple foods
{
  "messages": ["Tell me about the nutrition in apples"]
}

// Comparison
{
  "messages": ["Which has more fiber: oats or quinoa?"]
}
```

## Deployment to Mastra Cloud

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Nutrition AI Agent"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/nutrition-agent.git
git branch -M main
git push -u origin main
```

**Verify:** Make sure `.env` is NOT in your GitHub repository!

### Step 2: Deploy to Mastra Cloud

1. **Sign up**: Go to https://cloud.mastra.ai
2. **Create Project**: Click "New Project" or "Import"
3. **Connect GitHub**: Select your `nutrition-agent` repository
4. **Add Environment Variables**:
   - `GOOGLE_API_KEY`: Your Gemini API key
   - `USDA_API_KEY`: Your USDA API key
5. **Deploy**: Click "Deploy" and wait 2-5 minutes

### Step 3: Get Your Agent URL

After deployment, your agent URL will be:
```
https://nutrition-agent.mastra.cloud/api/agents/nutritionAgent
```

This is your **A2A endpoint** for Telex.im integration!

### Step 4: Update workflow.json

Open `workflow.json` and update the URL:
```json
{
  "url": "https://nutrition-agent.mastra.cloud/api/agents/nutritionAgent"
}
```

## Integrating with Telex.im

### Step 1: Get Telex Access

In your HNG Stage 3 Backend channel:
```
/telex-invite your-email@example.com
```

Wait for confirmation email and log into Telex.im.

### Step 2: Upload Workflow Configuration

1. Log into Telex.im
2. Navigate to AI Co-Workers section
3. Create new co-worker
4. Upload your `workflow.json` file
5. Verify the agent appears in your agents list

### Step 3: Test in Telex

In a Telex channel, mention your agent:
```
@nutrition-assistant What's the nutrition info for salmon?
```

The agent should respond with detailed nutrition data!

### Step 4: View Agent Logs

Check your agent's interactions:
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

Get the `channel-id` from your Telex URL bar.

## Usage Examples

### Example 1: Simple Food Query
**User:** "What's in an apple?"

**Agent:** Returns nutrition facts including calories, vitamins, fiber, etc.

### Example 2: Food Comparison
**User:** "Compare brown rice and white rice"

**Agent:** Returns side-by-side comparison of both foods

### Example 3: Specific Nutrient
**User:** "How much protein is in chicken breast?"

**Agent:** Highlights protein content specifically

### Example 4: Multiple Foods
**User:** "Tell me about the nutrition in salmon and tuna"

**Agent:** Provides information for both foods

## Available Tools

### 1. searchFood
Searches the USDA database for a specific food and returns detailed nutrition information.

**Input:** Food name (e.g., "apple", "chicken breast")
**Output:** Nutrition facts per 100g serving

### 2. compareFoods
Compares nutritional values between two different foods.

**Input:** Two food names
**Output:** Side-by-side nutrition comparison

## API Endpoints

### Local Development (http://localhost:4111)

- `GET /health` - Health check
- `GET /api/agents` - List all agents
- `GET /api/agents/nutritionAgent` - Get agent info
- `POST /api/agents/nutritionAgent/generate` - Main agent endpoint

### Production (https://your-app.mastra.cloud)

Same endpoints as local, just different base URL.

## Troubleshooting

### Issue: "mastra is not recognized"
**Solution:**
```bash
npm install -g @mastra/cli
# OR use npx
npx mastra dev
```

### Issue: "USDA API key not configured"
**Solution:** Check your `.env` file has the correct `USDA_API_KEY` without quotes or extra spaces.

### Issue: "Module not found"
**Solution:**
```bash
npm install
```

### Issue: Agent not responding
**Solution:**
1. Check Mastra Cloud logs for errors
2. Verify environment variables are set correctly
3. Test with Postman first
4. Check USDA API key is valid

### Issue: "No nutrition data found"
**Solution:** Try more specific food names (e.g., "salmon, raw" instead of just "salmon")

### Issue: Port already in use
**Solution:** Kill the previous process with `Ctrl+C` and run `npm run dev` again

## Development Workflow

1. **Local Development**: Code and test locally with `npm run dev`
2. **Test with Postman**: Verify all endpoints work
3. **Push to GitHub**: Commit and push your changes
4. **Auto-Deploy**: Mastra Cloud automatically deploys from GitHub
5. **Test Production**: Verify deployed version works
6. **Integrate with Telex**: Upload workflow.json
7. **Monitor**: Check logs and usage

## Environment Variables

Required environment variables:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GOOGLE_API_KEY` | Google Gemini API key | https://makersuite.google.com/app/apikey |
| `USDA_API_KEY` | USDA FoodData Central API key | https://fdc.nal.usda.gov/api-key-signup.html |

## USDA API Limits

- **Free Tier**: 1,000 requests per hour
- **Data Coverage**: 300,000+ food items
- **Data Types**: Foundation Foods, SR Legacy (most comprehensive)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

**Your Name** - HNG Internship Stage 3 Backend Challenge

## Acknowledgments

- **USDA FoodData Central** for comprehensive nutrition data
- **Mastra** for the AI agent framework
- **Telex.im** for the platform integration
- **HNG Internship** for the opportunity

## Links

- **Live Agent**: https://nutrition-agent.mastra.cloud
- **GitHub Repository**: https://github.com/YOUR_USERNAME/nutrition-agent
- **Blog Post**: [Your blog post URL]
- **Tweet**: [Your tweet URL]
- **USDA API**: https://fdc.nal.usda.gov/
- **Mastra Documentation**: https://mastra.ai/docs
- **Telex Platform**: https://telex.im

## Support

For issues or questions:
- Open an issue on GitHub
- Check Mastra documentation
- Ask in HNG community channels

