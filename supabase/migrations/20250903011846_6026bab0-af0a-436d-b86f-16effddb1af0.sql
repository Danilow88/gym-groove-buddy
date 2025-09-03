-- Criar função para buscar usuários (para chat)
CREATE OR REPLACE FUNCTION public.search_users(search_term text)
RETURNS TABLE(id uuid, email text, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id,
    au.email,
    p.full_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.user_id
  WHERE 
    au.email ILIKE '%' || search_term || '%' OR
    p.full_name ILIKE '%' || search_term || '%'
  LIMIT 10;
$$;

-- Função para obter emails dos usuários (para chat)
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids uuid[])
RETURNS TABLE(id uuid, email text, full_name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id,
    au.email,
    p.full_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.user_id
  WHERE au.id = ANY(user_ids);
$$;