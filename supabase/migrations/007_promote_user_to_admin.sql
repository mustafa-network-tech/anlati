-- ANLATI: belirtilen kullanıcıya admin rolü ver.
-- Tekrar çalıştırılması güvenlidir; başka hiçbir kullanıcıyı etkilemez.
do $$
declare
  affected_rows integer;
begin
  update public.profiles
  set role = 'admin', updated_at = now()
  where id = '97b888ac-12e8-4593-beaa-67380a1ba210'::uuid;

  get diagnostics affected_rows = row_count;
  if affected_rows = 0 then
    raise exception 'Admin yapılacak profil bulunamadı: %',
      '97b888ac-12e8-4593-beaa-67380a1ba210';
  end if;
end
$$;
