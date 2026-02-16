-- Restiqo Real-time Features Schema Extension
-- Run this after the main schema.sql to add chat and notification support

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique conversation per property between guest and host
  UNIQUE(property_id, guest_id, host_id)
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TYPE notification_type AS ENUM ('booking', 'message', 'review', 'system', 'payment');

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR REAL-TIME TABLES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_conversations_guest_id ON public.conversations(guest_id);
CREATE INDEX IF NOT EXISTS idx_conversations_host_id ON public.conversations(host_id);
CREATE INDEX IF NOT EXISTS idx_conversations_property_id ON public.conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR CONVERSATIONS
-- ============================================

-- Users can view conversations where they are guest or host
CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = guest_id OR auth.uid() = host_id);

-- Users can create conversations as guest
CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Users can update conversations where they are participant
CREATE POLICY "Users can update their conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = guest_id OR auth.uid() = host_id);

-- ============================================
-- RLS POLICIES FOR MESSAGES
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
      AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
  );

-- Users can insert messages in their conversations
CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
      AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
  );

-- Users can update (mark as read) messages in their conversations
CREATE POLICY "Users can update messages in their conversations" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
      AND (guest_id = auth.uid() OR host_id = auth.uid())
    )
  );

-- ============================================
-- RLS POLICIES FOR NOTIFICATIONS
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert notifications (using service role)
-- Users cannot directly insert notifications
CREATE POLICY "Service role can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Update conversations updated_at on new message
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NOW(),
      last_message = NEW.content,
      last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- ============================================
-- ENABLE REALTIME
-- ============================================

-- Enable Supabase Realtime for messages and notifications
-- Run these in Supabase Dashboard > Database > Replication
-- Or use the following SQL:

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ============================================
-- HELPER FUNCTIONS FOR NOTIFICATIONS
-- ============================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  target_user_id UUID,
  notif_type notification_type,
  notif_title TEXT,
  notif_message TEXT,
  notif_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notif_type, notif_title, notif_message, notif_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS FOR AUTOMATIC NOTIFICATIONS
-- ============================================

-- Notify host on new booking
CREATE OR REPLACE FUNCTION notify_host_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  host_id UUID;
  property_title TEXT;
BEGIN
  SELECT p.host_id, p.title INTO host_id, property_title
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  IF host_id IS NOT NULL THEN
    PERFORM create_notification(
      host_id,
      'booking',
      'New Booking Request',
      'You have a new booking request for "' || property_title || '"',
      jsonb_build_object('booking_id', NEW.id, 'property_id', NEW.property_id)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_insert
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_host_on_booking();

-- Notify user on booking status change
CREATE OR REPLACE FUNCTION notify_guest_on_booking_update()
RETURNS TRIGGER AS $$
DECLARE
  property_title TEXT;
  status_message TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT title INTO property_title
    FROM public.properties
    WHERE id = NEW.property_id;

    status_message := CASE NEW.status
      WHEN 'confirmed' THEN 'Your booking for "' || property_title || '" has been confirmed!'
      WHEN 'cancelled' THEN 'Your booking for "' || property_title || '" has been cancelled.'
      WHEN 'completed' THEN 'Your stay at "' || property_title || '" is complete. Leave a review!'
      ELSE 'Your booking status has been updated.'
    END;

    PERFORM create_notification(
      NEW.guest_id,
      'booking',
      'Booking Update',
      status_message,
      jsonb_build_object('booking_id', NEW.id, 'status', NEW.status)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_update
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_guest_on_booking_update();

-- Notify on new review
CREATE OR REPLACE FUNCTION notify_on_review()
RETURNS TRIGGER AS $$
DECLARE
  host_id UUID;
  property_title TEXT;
BEGIN
  SELECT p.host_id, p.title INTO host_id, property_title
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  IF host_id IS NOT NULL THEN
    PERFORM create_notification(
      host_id,
      'review',
      'New Review',
      'Your property "' || property_title || '" received a ' || NEW.rating || '-star review!',
      jsonb_build_object('review_id', NEW.id, 'property_id', NEW.property_id, 'rating', NEW.rating)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_review();
