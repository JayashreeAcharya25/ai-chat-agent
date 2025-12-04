# AI Agent Chat Application

A full-stack AI-powered chat application built with **FastAPI** (Python) backend and **Next.js** (TypeScript) frontend. This application provides an intelligent conversational interface using OpenAI's GPT-4 model through the PydanticAI framework.

## Project Structure

```
agents/
├── agent-server/          # Python FastAPI Backend
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Application core
│   │   ├── database/     # Data models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── app.py           # Application entry point
│   └── requirements.txt # Python dependencies
└── agent-ui/            # Next.js Frontend
    ├── components/      # React components
    ├── pages/          # Next.js pages
    ├── styles/         # CSS modules & themes
    └── package.json    # Node.js dependencies
```

## Features

### Backend (FastAPI)
- **AI Agent Integration**: Uses PydanticAI with OpenAI GPT-4
- **Conversation Management**: Create, update, delete conversations
- **Message History**: Persistent chat history storage
- **RESTful API**: Clean API endpoints for frontend integration
- **CORS Support**: Cross-origin requests enabled
- **Error Handling**: Comprehensive error management

### Frontend (Next.js)
- **Modern UI**: Material-UI components with custom theming
- **Responsive Design**: Mobile-friendly interface
- **Real-time Chat**: Interactive chat interface
- **Conversation Sidebar**: Easy conversation switching
- **TypeScript**: Type-safe development
- **Custom Styling**: CSS modules with theme system

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PydanticAI**: AI agent framework
- **OpenAI API**: GPT-4 language model
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Frontend
- **Next.js 16**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **Lucide React**: Icons
- **React Markdown**: Markdown rendering

## Prerequisites

- Python 3.8+
- Node.js 18+
- OpenAI API key

## Installation & Setup

### 1. Backend Setup

```bash
cd agent-server

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Run the server
python app.py
```

The backend will run on `http://localhost:8001`

### 2. Frontend Setup

```bash
cd agent-ui

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file in the `agent-server` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/conversations` | Create new conversation |
| GET | `/conversations` | Get all conversations |
| GET | `/conversations/{id}/messages` | Get conversation messages |
| PATCH | `/conversations/{id}` | Update conversation name |
| DELETE | `/conversations/{id}` | Delete conversation |
| GET | `/chat/{id}` | Get shared chat |
| POST | `/agent` | Send message to AI agent |

## Key Components

### Backend Services
- **AgentService**: Handles AI model interactions
- **ConversationService**: Manages conversation lifecycle
- **MessageService**: Handles message storage and retrieval

### Frontend Components
- **ChatArea**: Main chat interface
- **Sidebar**: Conversation navigation
- **ChatMessage**: Individual message display
- **WelcomeScreen**: Initial user interface

## Data Flow

1. User sends message through frontend
2. Frontend makes API call to `/agent` endpoint
3. Backend processes message through PydanticAI
4. OpenAI GPT-4 generates response
5. Response stored in conversation history
6. Frontend displays AI response

## Theming

The application uses a custom theme system with:
- Dark gradient backgrounds
- Consistent color palette
- Responsive spacing
- Modern typography
- Custom CSS properties

## Running the Application

1. Start the backend server: `python app.py` (port 8001)
2. Start the frontend: `npm run dev` (port 3000)
3. Open browser to `http://localhost:3000`
4. Start chatting with the AI agent!

## Development Notes

- **File Storage**: Uses JSON files for data persistence
- **Agent Model**: Configured to use OpenAI GPT-4
- **CORS**: Enabled for all origins in development
- **Error Handling**: Includes API quota and model error handling
- **Mobile Support**: Responsive design with drawer navigation

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication
- File upload support
- Real-time WebSocket connections
- Agent customization options
- Conversation sharing features

**Built with ❤️ using FastAPI, Next.js, and OpenAI**