import ballerinax/openai.chat;
import ballerina/io;
import ballerina/os;

public function main() returns error? {
    // Retrieve the API key from the environment variable
    string token = os:getEnv("OPENAI_API_KEY");

    final chat:Client openAIChat = check new({
        auth: {
            token: token
        }
    });

    // Create a chat completion request.
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini", // Use a valid model name
        messages: [{
            "role": "user",
            "content": "What is Ballerina programming language?"
        }]
    };

    // Send the request and get the response.
    chat:CreateChatCompletionResponse response = check openAIChat->/chat/completions.post(request);

    // Print the response content.
    if response.choices.length() > 0 {
        io:println(response.choices[0].message?.content);
    } else {
        io:println("No response received from OpenAI.");
    }

}