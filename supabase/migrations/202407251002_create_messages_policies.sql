-- Enable Row Level Security on messages table
alter table public.messages enable row level security;

-- Select: users can read messages that belong to chats they own
create policy "Users can select their messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
        and chats.user_id = auth.uid()
    )
  );

-- Insert: users can create a message for a chat they own
create policy "Users can insert their messages"
  on public.messages for insert
  with check (
    messages.user_id = auth.uid() and
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
        and chats.user_id = auth.uid()
    )
  );

-- Update: users can modify messages they own (and belonging to their chat)
create policy "Users can update their messages"
  on public.messages for update
  using (
    messages.user_id = auth.uid() and
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
        and chats.user_id = auth.uid()
    )
  )
  with check (
    messages.user_id = auth.uid()
  );

-- Delete: users can delete messages they own (and belonging to their chat)
create policy "Users can delete their messages"
  on public.messages for delete
  using (
    messages.user_id = auth.uid() and
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id
        and chats.user_id = auth.uid()
    )
  );
