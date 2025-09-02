# 日本語 Drilling

A Japanese translation practice app with adaptive difficulty and ELO-based progression.

## Purpose

This application helps users practice Japanese translation skills through an intelligent drilling system that:
- Adapts difficulty based on your performance using an ELO rating system
- Provides instant feedback on translations
- Focuses on specific grammar patterns when you make mistakes
- Tracks your progress across multiple practice sessions
- Offers subject-specific practice (weather, food, daily routine, etc.)

## Features

- **Adaptive Difficulty**: ELO system (500-3000) adjusts question difficulty based on your answers
- **Smart Pattern Practice**: When you get an answer wrong, the next question focuses on the same grammar pattern
- **Session Management**: Save and resume practice sessions with automatic progress tracking
- **Real-time Feedback**: Get immediate evaluation and corrections for your translations
- **Subject Focus**: Choose specific topics or practice mixed content
- **Progress Tracking**: View your current ELO, exercises completed, and session history

## How to Start the Project

### Prerequisites
- Node.js (v18 or higher)
- Bun package manager
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nihongo-drilling
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your OpenAI API key:
   ```bash
   # Create a .env file in the root directory
   echo "NUXT_OPENAI_KEY=your_openai_api_key_here" > .env
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

5. Open your browser to `http://localhost:3000`

## How to Use

### Starting a New Session
1. Visit the home page
2. Optionally choose a subject (weather, food, plans, etc.) or leave empty for mixed topics
3. Adjust your starting ELO using the slider (500 = Beginner, 3000 = Expert)
4. Click "Start New Practice"

### Practicing
1. Read the English sentence presented
2. Type your Japanese translation in the text area
3. Submit your answer using the button or **Shift + Enter**
4. Review the feedback and correct answer (if incorrect)
5. Click "Next Exercise" to continue with a new question
6. Your progress is automatically saved after each attempt

### Continuing Previous Sessions
1. On the home page, you'll see your saved practice sessions
2. Click on any session to resume where you left off
3. Sessions show your current ELO, exercises completed, and last practice time
4. Delete unwanted sessions using the trash icon

### Keyboard Shortcuts
- **Shift + Enter**: Submit your current answer

## ELO System

The app uses an ELO rating system to track your skill level:
- **500-800**: Beginner (N5 level patterns)
- **800-1400**: Intermediate (N5/N4 level)
- **1400-2000**: Upper Intermediate (N4/N3 level)
- **2000-2600**: Advanced (N3/N2 level)
- **2600-3000**: Expert (N2+ level)

- Correct answers: +20 ELO (capped at 3000)
- Incorrect answers: No ELO change
- Questions adapt to your current ELO level

## Technical Details

Built with:
- **Nuxt 3** - Vue.js framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Question generation and evaluation
- **LocalStorage** - Session persistence

The app uses OpenAI's API with a custom prompt to generate contextually appropriate translation exercises and provide detailed feedback on your attempts.