create or replace function increment_menu_view(p_restaurant_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into menu_views (restaurant_id, day, count)
  values (p_restaurant_id, current_date, 1)
  on conflict (restaurant_id, day)
  do update set count = menu_views.count + 1;

  update restaurants
  set view_count = view_count + 1
  where id = p_restaurant_id;
end;
$$;

grant execute on function increment_menu_view(uuid) to anon, authenticated;