-- Create restaurants table
create table public.restaurants (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurants_pkey primary key (id)
);

-- Create menu_items table
create table public.menu_items (
  id uuid not null default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null,
  is_available boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_items_pkey primary key (id)
);

-- Create orders table
create table public.orders (
  id uuid not null default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'ready', 'rejected', 'completed')),
  total_amount decimal(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_pkey primary key (id)
);

-- Create order_items table
create table public.order_items (
  id uuid not null default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null, -- Snapshot of price at time of order
  created_at timestamptz not null default now(),
  constraint order_items_pkey primary key (id)
);

-- Add indexes for better performance
create index restaurants_user_id_idx on public.restaurants(user_id);
create index menu_items_restaurant_id_idx on public.menu_items(restaurant_id);
create index orders_restaurant_id_idx on public.orders(restaurant_id);
create index order_items_order_id_idx on public.order_items(order_id);

-- Enable Row Level Security (RLS)
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for restaurants
-- Anyone can view restaurants (public profile)
create policy "Public restaurants are viewable by everyone"
  on public.restaurants for select
  using (true);

-- Users can insert their own restaurant
create policy "Users can insert their own restaurant"
  on public.restaurants for insert
  with check (auth.uid() = user_id);

-- Users can update their own restaurant
create policy "Users can update their own restaurant"
  on public.restaurants for update
  using (auth.uid() = user_id);

-- Policies for menu_items
-- Anyone can view menu items
create policy "Menu items are viewable by everyone"
  on public.menu_items for select
  using (true);

-- Restaurant owners can insert menu items
create policy "Restaurant owners can insert menu items"
  on public.menu_items for insert
  with check (
    exists (
      select 1 from public.restaurants
      where id = restaurant_id
      and user_id = auth.uid()
    )
  );

-- Restaurant owners can update menu items
create policy "Restaurant owners can update menu items"
  on public.menu_items for update
  using (
    exists (
      select 1 from public.restaurants
      where id = restaurant_id
      and user_id = auth.uid()
    )
  );

-- Restaurant owners can delete menu items
create policy "Restaurant owners can delete menu items"
  on public.menu_items for delete
  using (
    exists (
      select 1 from public.restaurants
      where id = restaurant_id
      and user_id = auth.uid()
    )
  );

-- Policies for orders
-- Restaurant owners can view their orders
create policy "Restaurant owners can view their orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.restaurants
      where id = restaurant_id
      and user_id = auth.uid()
    )
  );

-- Anyone (Customers) can insert orders
create policy "Customers can insert orders"
  on public.orders for insert
  with check (true);

-- Restaurant owners can update orders (e.g. change status)
create policy "Restaurant owners can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.restaurants
      where id = restaurant_id
      and user_id = auth.uid()
    )
  );

-- Policies for order_items
-- Restaurant owners can view order items
create policy "Restaurant owners can view order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id
      and exists (
        select 1 from public.restaurants
        where id = orders.restaurant_id
        and user_id = auth.uid()
      )
    )
  );

-- Anyone (Customers) can insert order items
create policy "Customers can insert order items"
  on public.order_items for insert
  with check (true);
