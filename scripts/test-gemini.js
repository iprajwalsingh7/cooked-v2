const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    require('dotenv').config({ path: '.env.local' });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = [
        "gemini-2.0-flash-lite-preview-02-05",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    for (const modelName of models) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`SUCCESS: ${modelName} works! Response:`, result.response.text());
            return; // Stop after finding a working model
        } catch (error) {
            console.error(`FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
        }
    }
}

listModels();
