# Budget Tracking App

A modern, production-ready budget tracking mobile application built with Expo, React Native, and Supabase.

## Features

### 🔐 Authentication
- Email/password sign up and login
- Secure user authentication with Supabase Auth
- Form validation and error handling
- User profile management

### 💰 Transaction Management
- Add income and expense transactions
- Custom categories with icons and colors
- Real-time transaction history
- Delete transactions with confirmation
- Automatic balance calculation

### 📊 Data Visualization
- Interactive spending charts by category
- Yearly income vs expenses comparison
- Animated pie charts with percentages
- Monthly breakdown visualization
- Real-time data updates

### 🎯 Savings Goals
- Create and manage savings goals
- Track progress with visual indicators
- Add money to goals
- Edit existing goals
- Goal completion tracking

### 🎨 Modern UI/UX
- Clean, minimalist design
- Dark/light theme toggle
- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive navigation with tab layout

### 📱 Real-time Sync
- Live data synchronization with Supabase
- Automatic updates across all views
- Offline-first architecture
- Real-time subscriptions

## Tech Stack

- **Frontend**: React Native, Expo Router, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: React Native Chart Kit, Recharts
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Fonts**: Inter (Google Fonts)

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- Supabase account

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the following schema:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) DEFAULT 0,
  month TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create savings_goals table
CREATE TABLE savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  target_date DATE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own savings goals" ON savings_goals FOR ALL USING (auth.uid() = user_id);

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3. Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Running the App

- **Web**: Open the provided localhost URL in your browser
- **Mobile**: Use the Expo Go app to scan the QR code
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen with charts
│   │   ├── transactions.tsx # Add transactions
│   │   ├── goals.tsx      # Savings goals
│   │   └── settings.tsx   # Settings & profile
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── charts/           # Chart components
│   ├── ui/               # UI components
│   └── animations/       # Animation components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Theme management
├── hooks/                # Custom hooks
│   ├── useTransactions.ts # Transaction management
│   ├── useCategories.ts  # Category management
│   └── useSavingsGoals.ts # Goals management
├── lib/                  # Utilities
│   └── supabase.ts       # Supabase client
└── types/                # TypeScript types
    ├── database.ts       # Database types
    └── index.ts          # General types
```

## Key Features Explained

### Real-time Data Sync
The app uses Supabase's real-time subscriptions to automatically update data across all screens when changes occur. This ensures users always see the latest information without manual refreshes.

### Interactive Charts
- **Spending Chart**: Animated pie chart showing expense breakdown by category
- **Yearly Chart**: Bar chart comparing monthly income vs expenses
- **Progress Bars**: Visual indicators for savings goals and budgets

### Authentication Flow
- Secure email/password authentication
- Form validation with error handling
- Automatic profile creation on signup
- Session persistence across app restarts

### Data Management
- CRUD operations for all data types
- Real-time updates using Supabase subscriptions
- Row Level Security (RLS) for data protection
- Optimistic updates for better UX

## Customization

### Adding New Categories
Categories are automatically created for new users. To add custom categories, users can extend the category system through the transaction screen.

### Theming
The app supports both light and dark themes. Theme colors can be customized in `contexts/ThemeContext.tsx`.

### Charts
Chart components are modular and can be easily customized or replaced. They accept data props and handle animations automatically.

## Production Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Store
1. Configure app.json with your app details
2. Build with EAS Build: `eas build`
3. Submit to app stores: `eas submit`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.