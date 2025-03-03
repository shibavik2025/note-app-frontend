# Note App - Frontend

This is the frontend for the Note Management application, built with Next.js,TypeScript, and TailwindCSS.

## Features
- Create, edit, delete, and categorize notes
- Search notes with keywords
- AI-powered summarization and categorization
- AI-powered Sentiment analysis for notes
- User-friendly interface with responsive design

## Tech Stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- State Management: React hooks
- Icons: Lucide-react
- AI model: hugging face 
- Testing: Jest

##  Installation & Setup

### Clone the Repository
```sh
git clone https://github.com/yourusername/note-app-frontend.git
cd note-app-frontend
```

###  Install Dependencies
```sh
npm install  # or yarn install
```

### Set Up Environment Variables
Create a `.env.local` file in the root directory and add:
```sh
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
HUGGINGFACE_API_KEY="" # Huggingface secret
```

###  Run the Development Server
```sh
npm run dev  # or yarn dev
```

The app will be available at `http://localhost:3000`.

##  Running Tests
```sh
npm test  # Run unit tests with Jest
npm run test -- --coverage
```

##  Build for Production
```sh
npm run build
npm start
```
