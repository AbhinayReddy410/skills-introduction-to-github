# LegalEase - Legal Practice Management App

A simple, powerful mobile app for legal professionals to manage cases, hearings, documents, and client communications.

## Features

- **Case Management** - Track all your cases with detailed information
- **Hearing Calendar** - Never miss a court date with upcoming hearings view
- **Document Storage** - Upload and manage case documents securely
- **Real-time Messaging** - Communicate with clients in real-time
- **Simple Authentication** - Secure OTP-based email login
- **Clean UI** - Easy to use interface built with React Native

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Realtime)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/legal-ease.git
cd legal-ease
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

- Go to [supabase.com](https://supabase.com) and create a new project
- Go to SQL Editor and run the schema from `supabase/schema.sql`
- Go to Storage and create a bucket named "documents" (set to private)
- Go to Authentication → Settings → Enable Email OTP
- Go to Settings → API to get your project URL and anon key

4. **Configure environment**

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. **Run the app**

```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
legal-ease/
├── app/                      # Screens (Expo Router)
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.tsx      # Auth layout
│   │   └── login.tsx        # Login screen
│   ├── (tabs)/              # Main tab navigation
│   │   ├── _layout.tsx      # Tabs layout
│   │   ├── index.tsx        # Cases list
│   │   ├── calendar.tsx     # Hearings calendar
│   │   ├── messages.tsx     # Messages list
│   │   └── settings.tsx     # Settings/profile
│   ├── case/                # Case screens
│   │   ├── [id].tsx         # Case detail
│   │   └── new.tsx          # New case form
│   ├── chat/                # Chat screens
│   │   └── [id].tsx         # Chat conversation
│   ├── hearing/             # Hearing screens
│   │   └── new.tsx          # New hearing form
│   └── _layout.tsx          # Root layout
├── components/              # Reusable components
│   └── DocumentList.tsx     # Document list component
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Authentication
│   ├── useCases.ts          # Case management
│   ├── useDocuments.ts      # Document uploads
│   └── useMessages.ts       # Real-time messaging
├── lib/                     # Libraries & config
│   └── supabase.ts          # Supabase client
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
├── supabase/                # Database
│   └── schema.sql           # Database schema
└── .env.example             # Environment template
```

## Code Philosophy

This project follows the principle of **simplicity**:

- ✅ Simple, readable code that beginners can understand
- ✅ No complex patterns or over-engineering
- ✅ Minimal dependencies
- ✅ Clear naming conventions
- ✅ Basic React hooks (useState, useEffect)
- ✅ Direct database queries (no complex state management)

## Database Schema

The app uses 6 main tables:

1. **profiles** - User profiles (advocates/clients)
2. **cases** - Case information with parties and notes
3. **documents** - Case documents stored in Supabase Storage
4. **hearings** - Court hearing schedules
5. **messages** - Real-time chat messages
6. **templates** - Document templates (future feature)

All tables have Row-Level Security (RLS) policies for data protection.

## Features Overview

### Authentication
- Email-based OTP login (no passwords!)
- Automatic profile creation on signup
- Persistent sessions with AsyncStorage

### Case Management
- Create cases with parties (petitioners/respondents)
- Track case stages (Filing, Notice, Evidence, etc.)
- Add notes and case details
- Search and filter cases

### Hearings
- Add hearing dates, times, and locations
- View upcoming hearings on calendar
- Link hearings to cases
- Reminders (future feature)

### Documents
- Upload PDFs and images
- Organize by case
- Secure storage with Supabase
- Delete with confirmation

### Messaging
- Real-time chat with Supabase Realtime
- Conversation threads
- Message history
- Read receipts (future feature)

## Development

### Running in Development

```bash
# Start Expo dev server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Contributing

This is a simple educational project. Feel free to fork and customize for your needs!

## License

MIT License - feel free to use this code for your own projects.

## Support

For issues or questions:
1. Check the [Expo documentation](https://docs.expo.dev)
2. Check the [Supabase documentation](https://supabase.com/docs)
3. Open an issue on GitHub

## Roadmap

Future features to add:
- [ ] Document templates with variables
- [ ] Push notifications for hearings
- [ ] Case analytics dashboard
- [ ] Client portal access
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support

---

Built with ❤️ using React Native, Expo, and Supabase
