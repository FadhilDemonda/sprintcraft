-- ==============================================================================
-- SprintCraft AI - Seed User Creation in Supabase Auth
-- Email: test1@gmail.com
-- Password: 123qwe
-- ==============================================================================

-- 1. Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'test1@gmail.com';
  user_pass TEXT := '123qwe';
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = user_email;

  IF existing_user_id IS NOT NULL THEN
    -- Update existing user's password and confirm email
    UPDATE auth.users
    SET 
      encrypted_password = crypt(user_pass, gen_salt('bf')),
      email_confirmed_at = NOW(),
      updated_at = NOW(),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = '{"name":"Fadhil Test"}'::jsonb
    WHERE id = existing_user_id;

    -- Ensure profile exists
    INSERT INTO public.profiles (id, email, name, avatar_url, role)
    VALUES (
      existing_user_id,
      user_email,
      'Fadhil Test',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'Product Engineer'
    )
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, email = EXCLUDED.email;

    RAISE NOTICE 'User % updated successfully with confirmed email and new password.', user_email;
  ELSE
    -- Insert new user into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      user_email,
      crypt(user_pass, gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Fadhil Test"}'::jsonb,
      NOW(),
      NOW()
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id, user_email)::jsonb,
      'email',
      new_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );

    -- Insert into public.profiles
    INSERT INTO public.profiles (id, email, name, avatar_url, role)
    VALUES (
      new_user_id,
      user_email,
      'Fadhil Test',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'Product Engineer'
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'User % created successfully with ID: %', user_email, new_user_id;
  END IF;
END $$;
