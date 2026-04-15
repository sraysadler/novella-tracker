import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types";

export async function getUserRole(supabase: SupabaseClient): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data.role as UserRole;
}

export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const role = await getUserRole(supabase);
  return role === "admin";
}

export async function isEditor(supabase: SupabaseClient): Promise<boolean> {
  const role = await getUserRole(supabase);
  return role === "editor" || role === "admin";
}
