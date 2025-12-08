-- ============================================
-- LOWKEY LUXURY - COMPLETE DATABASE SETUP
-- Run this script once to set up everything
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  membership_tier TEXT DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
CREATE POLICY "Allow users to view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to view products" ON public.products;
CREATE POLICY "Allow public to view products"
  ON public.products FOR SELECT
  USING (TRUE);

-- ============================================
-- 3. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_price_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
CREATE POLICY "Allow users to view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert their own orders" ON public.orders;
CREATE POLICY "Allow users to insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their order items" ON public.order_items;
CREATE POLICY "Allow users to view their order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. TOOLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  access_level TEXT DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to view tools" ON public.tools;
CREATE POLICY "Allow public to view tools"
  ON public.tools FOR SELECT
  USING (TRUE);

-- ============================================
-- 6. USER TOOLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  access_granted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

ALTER TABLE public.user_tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own tool access" ON public.user_tools;
CREATE POLICY "Allow users to view their own tool access"
  ON public.user_tools FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert their own tool access" ON public.user_tools;
CREATE POLICY "Allow users to insert their own tool access"
  ON public.user_tools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor',
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admins to view themselves" ON public.admin_users;
CREATE POLICY "Allow admins to view themselves"
  ON public.admin_users FOR SELECT
  USING (auth.uid() = id);

-- ============================================
-- 8. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admins to view audit logs" ON public.audit_logs;
CREATE POLICY "Allow admins to view audit logs"
  ON public.audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- ============================================
-- 9. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 10. ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Admins can view all analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 11. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ============================================
-- 12. TRIGGER FOR AUTO PROFILE CREATION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, membership_tier)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', 'User'),
    'user',
    'public'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 13. SEED DEFAULT TOOLS
-- ============================================
INSERT INTO public.tools (name, description, access_level) VALUES
  ('Market Intelligence', 'Real-time luxury market trends and insights', 'premium'),
  ('Lifestyle Planner', 'AI-powered personal lifestyle and schedule management', 'vip'),
  ('Investment Advisory', 'Exclusive investment opportunities in luxury assets', 'elite'),
  ('Private Event Coordinator', 'Access to coordinate private luxury events', 'vip'),
  ('Wellness Concierge', 'Premium health and wellness services planning', 'premium'),
  ('Travel Elite', 'Exclusive travel planning and bookings', 'vip'),
  ('Art Acquisition', 'Access to rare and exclusive art collections', 'elite'),
  ('Luxury Fleet Management', 'Manage and book luxury vehicles', 'premium')
ON CONFLICT DO NOTHING;
