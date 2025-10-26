# SQL Setup

## Create Contacts Table

Run this SQL in your Supabase SQL Editor to create the `contacts` table:

```sql
-- Create contacts table
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz default now()
);

-- Add index for email lookups
create index if not exists contacts_email_idx on contacts(email);

-- Enable Row Level Security (RLS)
alter table contacts enable row level security;

-- Create policy to allow service role to insert
create policy "Service role can insert contacts"
  on contacts
  for insert
  to authenticated
  with check (true);

-- Create policy to allow service role to read contacts
create policy "Service role can read contacts"
  on contacts
  for select
  to authenticated
  using (true);
```

## Explanation

- **id**: UUID primary key, auto-generated
- **email**: Text field for storing contact email
- **created_at**: Timestamp, automatically set to current time
- **Index**: Speeds up email lookups
- **RLS**: Row Level Security enabled for data protection
- **Policies**: Allow authenticated requests (service role) to insert and read

## Verify Table Creation

After running the SQL:

1. In Supabase dashboard, click **Table Editor** in the left sidebar
2. You should see `contacts` table
3. Click on it to view structure
4. Columns should be: `id`, `email`, `created_at`

## Test Insert (Optional)

You can test manually in SQL Editor:

```sql
-- Insert a test contact
insert into contacts (email) values ('test@example.com');

-- Query all contacts
select * from contacts;

-- Delete test contact
delete from contacts where email = 'test@example.com';
```
