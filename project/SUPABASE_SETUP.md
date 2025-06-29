# Supabase Setup Instructions

Follow these steps to set up Supabase for your budget tracking app:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: "Budget Tracker" (or your preferred name)
   - Database Password: Generate a strong password and save it
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this takes a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned" message

## 5. Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `profiles`
   - `categories`
   - `transactions`
   - `budgets`
   - `savings_goals`

## 6. Configure Authentication (Optional)

1. Go to **Authentication** > **Settings**
2. Configure your authentication settings:
   - **Site URL**: Add your app's URL (for development: `http://localhost:8081`)
   - **Email confirmation**: Disable for development (enable for production)
   - **Email templates**: Customize if needed

## 7. Test the Connection

1. Restart your development server: `npm run dev`
2. The app should now connect to Supabase
3. Try creating an account to test the authentication flow

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**:
   - Make sure your `.env` file has the correct variable names
   - Restart your development server after updating `.env`

2. **Authentication not working**:
   - Check that RLS policies are enabled
   - Verify your Site URL in Supabase Auth settings

3. **Database connection issues**:
   - Ensure the migration was run successfully
   - Check that all tables exist in the Table Editor

4. **CORS errors**:
   - Add your development URL to the allowed origins in Supabase settings

### Getting Help:

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [Supabase Discord community](https://discord.supabase.com)
- Review the app logs for specific error messages

## Next Steps

Once Supabase is set up:

1. Create a test account in your app
2. Add some transactions and categories
3. Create savings goals
4. Verify that data persists and syncs in real-time

Your budget tracking app is now ready to use with Supabase!