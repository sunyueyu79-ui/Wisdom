-- Wisdom private quote collection. Run once in the project's SQL Editor.
begin;
create table public.wisdom_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null check (article_id ~ '^[a-z0-9-]{1,80}$'),
  article_title text not null check (char_length(article_title) between 1 and 160),
  quote_text text not null check (char_length(quote_text) between 8 and 280),
  page integer not null check (page between 1 and 10000),
  end_page integer not null check (end_page between page and 10000),
  created_at timestamptz not null default now(),
  unique (user_id, article_id, quote_text, page, end_page)
);
create index wisdom_favorites_user_date on public.wisdom_favorites(user_id, created_at desc);
alter table public.wisdom_favorites enable row level security;
revoke all on public.wisdom_favorites from anon, authenticated;
revoke all on public.wisdom_favorites from public;
grant select, insert, delete on public.wisdom_favorites to authenticated;
create policy favorites_read_own on public.wisdom_favorites for select to authenticated using ((select auth.uid()) = user_id);
create policy favorites_insert_own on public.wisdom_favorites for insert to authenticated with check ((select auth.uid()) = user_id);
create policy favorites_delete_own on public.wisdom_favorites for delete to authenticated using ((select auth.uid()) = user_id);
commit;
