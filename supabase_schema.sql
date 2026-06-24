-- RUET URP'25 Database Setup Schema
-- Copy and paste this script into your Supabase SQL Editor (https://supabase.com)

-- 1. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id text PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    date text NOT NULL,
    author text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    roll text PRIMARY KEY,
    name text NOT NULL,
    mobiles text[] NOT NULL DEFAULT '{}',
    emails text[] NOT NULL DEFAULT '{}',
    facebook text NOT NULL DEFAULT '',
    bio text NOT NULL DEFAULT '',
    avatar text NOT NULL DEFAULT '',
    tags text[] NOT NULL DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id text PRIMARY KEY,
    title text NOT NULL,
    caption text NOT NULL,
    "imageUrl" text NOT NULL,
    category text NOT NULL,
    date text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key text PRIMARY KEY,
    "aboutUs" text NOT NULL,
    "aboutUsImage" text NOT NULL,
    policy text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONTACT INFO TABLE
CREATE TABLE IF NOT EXISTS public.contact_info (
    key text PRIMARY KEY,
    email text NOT NULL,
    phone text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ONLINE PLATFORMS TABLE
CREATE TABLE IF NOT EXISTS public.online_platforms (
    id text PRIMARY KEY,
    name text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDERS / CHECKOUT TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    product_name text NOT NULL,
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- CREATE RLS POLICIES FOR PUBLIC READ-ONLY ACCESS
CREATE POLICY "Allow public read access on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public read access on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery_items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on admin_settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contact_info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access on online_platforms" ON public.online_platforms FOR SELECT USING (true);
CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);

-- CREATE RLS POLICIES FOR ADMIN FULL CONTROL (Using service role or bypass for simple admin updates)
-- For client-side without auth logins, we can create policies that allow anyone to modify (with passcode guard inside our app code), or enable insert/update/delete for authenticated.
-- To allow the client-side to do CRUD using the Anon key safely, let's create ALL permissions policies for Anon users, so that they can perform operations directly.
CREATE POLICY "Allow anonymous CRUD on notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on gallery_items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on contact_info" ON public.contact_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on online_platforms" ON public.online_platforms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous CRUD on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ENABLE REALTIME FOR ALL TABLES
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_info;
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_platforms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
