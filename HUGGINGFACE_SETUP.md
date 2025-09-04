# 🤗 Hugging Face API Setup Guide

## Issue Found
Your current Hugging Face API key doesn't have the required permissions for the Inference API. Here's how to fix it:

## 📝 Steps to Fix:

### Option 1: Create a New Token with Proper Permissions
1. **Go to:** [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. **Click:** "New token"
3. **Name:** Give it a name like "Neuron Chatbot"
4. **Role:** Select "write" or make sure it includes "Inference API" permissions
5. **Copy** the new token
6. **Replace** the token in your `.env` file:
   ```
   VITE_HUGGINGFACE_API_KEY=hf_your_new_token_here
   ```

### Option 2: Alternative AI Providers
If you prefer to use a different AI provider, here are some options:

#### OpenAI (Most Popular)
1. Get API key: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Update `.env`:
   ```
   VITE_OPENAI_API_KEY=sk-your_openai_key_here
   VITE_DEFAULT_AI_PROVIDER=openai
   ```

#### Google Gemini (Free tier available)
1. Get API key: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Update `.env`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_DEFAULT_AI_PROVIDER=gemini
   ```

## 🔄 After Updating the Token:
1. **Restart** the development server:
   ```bash
   npm run dev
   ```
2. **Test** the chatbot - it should now show "Powered by huggingface" and give real AI responses

## 💡 Current Status:
- ✅ Chatbot is working with enhanced simulation mode
- ⚠️ Need proper API permissions for real AI responses
- 🔧 Configuration modal available (click ⚙️ in header) to switch providers

## 🆘 Need Help?
- Check the browser console (F12) for detailed error messages
- Make sure you restart the dev server after changing environment variables
- Verify your token has the correct permissions on Hugging Face
