create table public.chats (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade not null,
     title text,
     created_at timestamptz default now() not null
   );

   alter table public.chats enable row level security;

   create policy "Users can view their own chats"
     on public.chats for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own chats"
     on public.chats for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own chats"
     on public.chats for update
     using (auth.uid() = user_id);

   create policy "Users can delete their own chats"
     on public.chats for delete
     using (auth.uid() = user_id);