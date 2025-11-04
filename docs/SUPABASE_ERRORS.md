# Supabase Errors - Troubleshooting Guide

## Common Errors

### 406 (Not Acceptable) and 400 (Bad Request) Errors

These errors typically occur when:
1. **RLS (Row Level Security) policies** are blocking access
2. **API headers** don't match what Supabase expects
3. **Profile doesn't exist** yet (should be created by trigger)

## Solutions

### 1. Check RLS Policies

Make sure your `profiles` table has proper RLS policies:

```sql
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### 2. Verify Trigger Creates Profile

The profile should be auto-created when a user signs up. Check your trigger:

```sql
-- Should be in your database setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Development vs Production

- **Development**: Errors are logged but don't break the app
- **Production**: Errors are silently handled - profile might not exist yet

## Current Implementation

The code now:
- Uses `maybeSingle()` instead of `single()` to handle null results
- Only logs non-critical errors
- Silently handles missing profiles (they'll be created on first update)
- Gracefully degrades if Supabase is not configured

## Testing

If you see 406/400 errors:
1. Check Supabase dashboard → Authentication → Policies
2. Verify your user is authenticated
3. Check if profile exists in `profiles` table
4. Review RLS policies for the `profiles` table

