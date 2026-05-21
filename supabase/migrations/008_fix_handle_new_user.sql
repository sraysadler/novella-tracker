-- 008_fix_handle_new_user.sql
-- handle_new_user is a trigger function and should never be callable
-- directly via the PostgREST RPC API. Revoke execute from all roles.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, PUBLIC;

-- Also fix the mutable search_path warning (function_search_path_mutable).
-- Pinning search_path prevents a malicious caller from redirecting schema lookups.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
