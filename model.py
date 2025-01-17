from flask import Flask, request, jsonify
from flask_cors import CORS
from groclake.modellake import ModelLake
import os

app = Flask(__name__)
CORS(app)

GROCLAKE_API_KEY = '65b9eea6e1cc6bb9f0cd2a47751a186f'
GROCLAKE_ACCOUNT_ID = '3ddb1f07de092e40e54278fb4a779285'

os.environ['GROCLAKE_API_KEY'] = GROCLAKE_API_KEY
os.environ['GROCLAKE_ACCOUNT_ID'] = GROCLAKE_ACCOUNT_ID

model_lake = ModelLake()

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat requests for coding assistance.
    """
    # Define the coding-focused context
    common_content = (
        "You are a personal coding assistant specialized in the following areas:\n"
        "- Modern web development (React, Next.js, TypeScript, etc.)\n"
        "- Backend development (Node.js, Python, Go, databases, etc.)\n"
        "- Best practices and design patterns\n"
        "- Debugging and performance optimization\n"
        "- DevOps and CI/CD workflows\n\n"
        "Your goal is to provide clear, concise, and actionable coding solutions. "
        "Prioritize TypeScript for frontend-related questions and Go for backend "
        "examples unless specified otherwise. Include brief comments for clarity."
    )

    # System role for more personalized responses
    referer = request.headers.get('Referer', '')
    if 'frontend' in referer:
        system_content = "You are a Frontend Development Expert specializing in React, TypeScript, and UI design."
    elif 'backend' in referer:
        system_content = "You are a Backend Development Expert specializing in APIs, databases, and server design."
    elif 'devops' in referer:
        system_content = "You are a DevOps Expert specializing in CI/CD, cloud deployments, and containerization."
    else:
        system_content = "You are a Full-Stack Coding Expert."

    full_system_content = f"{system_content}\n\n{common_content}"

    # Parse the user's message
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    # Prepare the conversation payload
    conversation_history = [
        {"role": "system", "content": full_system_content},
        {"role": "user", "content": user_input},
    ]

    try:
        # Interact with Groclake's ModelLake
        payload = {"messages": conversation_history}
        response = model_lake.chat_complete(payload)
        bot_reply = response.get("answer", "I'm sorry, I couldn't process that. Please try again.")

        return jsonify({"response": bot_reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
