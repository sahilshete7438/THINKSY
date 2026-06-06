import "dotenv/config";

const getOpenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gemini-2.5-flash",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", options);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API error (${response.status}):`, errorText);
            throw new Error(`Gemini API responded with status ${response.status}`);
        }
        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            console.error("Gemini API response missing choices:", data);
            throw new Error("Invalid response format from Gemini API");
        }
        return data.choices[0].message.content; //reply
    } catch(err) {
        console.error("Error in getGeminiAPIResponse:", err);
        throw err; // rethrow so that the route handler knows it failed
    }
}

export default getOpenAIAPIResponse;