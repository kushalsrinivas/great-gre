# GRE Vocabulary Learning App

A fully functional GRE vocabulary learning app built with React Native and Expo, featuring an interactive learning session system, progress tracking, and gamification elements.

## Features Implemented

### ✅ Core Features
- **Splash Screen**: Animated splash with data initialization
- **Onboarding Flow**: 3-screen onboarding for new users
- **Home Dashboard**: Displays streaks, gems, daily goals, and progress
- **Word Lists Explorer**: Browse all GRE word lists with progress tracking
- **List Detail View**: View mastery percentage and stats for each list
- **Learning Session**: Interactive word learning with "Don't Know", "Unsure", "Know It" options
- **Session Summary**: Comprehensive review of completed learning sessions
- **Progress Tracking**: Automatic tracking of learned words and mastery levels
- **Streak System**: Daily streak calculation and tracking
- **Settings**: User profile and preferences management

### 📚 Data & Storage
- **SQLite Database**: Stores 3000+ GRE words across 7 word lists
- **AsyncStorage**: User preferences, streaks, and daily progress
- **Data Import**: Automatic import from JSON files on first launch

### 🎨 UI Components
- Custom dark theme matching design specifications
- Reusable components: Button, Card, ProgressBar, CircularProgress, Badge, WordCard
- Bottom tab navigation
- Responsive layouts

## Project Structure

```
gre-pres/
├── app/
│   ├── index.tsx                      # Splash screen
│   ├── _layout.tsx                    # Root layout with providers
│   ├── (auth)/
│   │   └── onboarding.tsx             # Onboarding flow
│   └── (main)/
│       ├── (tabs)/
│       │   ├── index.tsx              # Home dashboard
│       │   ├── lists.tsx              # Word lists explorer
│       │   ├── review.tsx             # Review & progress
│       │   └── settings.tsx           # Settings
│       ├── list-detail.tsx            # List detail view
│       ├── learning-session.tsx       # Learning session
│       └── session-summary.tsx        # Session completion
├── components/ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   ├── CircularProgress.tsx
│   ├── Badge.tsx
│   └── WordCard.tsx
├── contexts/
│   ├── UserContext.tsx                # User state management
│   └── ProgressContext.tsx            # Learning progress management
├── lib/
│   ├── storage/
│   │   ├── database.ts                # SQLite operations
│   │   ├── async-storage.ts           # AsyncStorage operations
│   │   └── import-data.ts             # Data import logic
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── constants/
│   │   └── theme.ts                   # Theme colors and styles
│   └── utils/
│       └── index.ts                   # Helper functions
└── reference/
    ├── GREWordList.json               # Word lists data
    └── vocabulary.json                # Extended vocabulary data
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## How It Works

### Data Flow

1. **App Launch**: 
   - Splash screen initializes SQLite database
   - Imports word lists from JSON files (if not already imported)
   - Checks onboarding status

2. **Onboarding** (First Launch):
   - User sets name, daily goal, and learning vibe
   - User profile is created in AsyncStorage

3. **Home Dashboard**:
   - Displays current streak and gems
   - Shows daily goal progress
   - Provides quick access to learning sessions

4. **Learning Session**:
   - User selects a word list
   - Words are presented one by one with full definitions
   - User marks confidence level for each word
   - Progress is saved to SQLite after each answer
   - Session summary shown at the end

5. **Progress Tracking**:
   - Word mastery levels stored in database
   - Daily progress tracked in AsyncStorage
   - Streaks calculated based on daily activity

### Key Technologies

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and SDK
- **Expo Router**: File-based navigation
- **SQLite**: Local database for word storage
- **AsyncStorage**: Key-value storage for user data
- **TypeScript**: Type safety
- **React Context**: State management

## Design Highlights

- **Dark Theme**: Beautiful dark UI matching modern app design
- **Gradient Accents**: Subtle blue gradients for primary actions
- **Card-Based Layout**: Clean, organized content presentation
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Polished user interactions

## Word Lists Included

1. Manhattan GRE Complete (500 words)
2. GRE Complete Vocabulary List
3. Barron's 333
4. 900+ Essential GRE Words
5. Word Power Made Easy
6. GRE101
7. High Frequency Words

Total: 3000+ words with definitions, synonyms, and examples

## Future Enhancements

### Not Yet Implemented (Coming Soon)
- **Testing Center**: MCQ and written tests
- **Flashcards Mode**: Quick review mode
- **Progress Analytics**: Charts and performance graphs
- **Daily Quests**: Gamification challenges
- **Achievements & Badges**: Reward system
- **Mastered Words Room**: Celebrate learned words
- **Global Search**: Search across all words
- **Custom Word Lists**: Create personal lists

## Development Notes

### State Management
- `UserContext`: Manages user profile, streaks, gems, daily progress
- `ProgressContext`: Manages learning sessions, word tracking

### Database Schema
- `word_lists`: All GRE word lists
- `words`: Individual words with definitions
- `vocabulary`: Extended word information (synonyms, examples)
- `learning_progress`: User's mastery levels for each word
- `test_scores`: Historical test performance

### AsyncStorage Keys
- `@gre_app:user_profile`: User profile data
- `@gre_app:daily_progress:YYYY-MM-DD`: Daily learning progress
- `@gre_app:statistics`: Overall statistics

## Troubleshooting

### Database Issues
- Delete app and reinstall to reset database
- Check `lib/storage/database.ts` for schema

### Data Import Fails
- Verify `reference/GREWordList.json` exists
- Check console for import errors
- May take 10-20 seconds on first launch

### Navigation Issues
- Ensure all route files exist in `app/` directory
- Check `expo-router` configuration

## Performance Considerations

- **Lazy Loading**: Word lists loaded on demand
- **Database Indexes**: Optimized queries for fast lookups
- **Memoization**: Expensive calculations cached
- **Efficient Rendering**: Lists use optimized rendering

## License

This project is for educational purposes.

## Credits

- Word data sourced from Vocabulary.com
- Inspired by popular language learning apps
- Built with ❤️ for GRE test takers

