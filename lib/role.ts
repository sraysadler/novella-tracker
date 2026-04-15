import { createClient } from "@/lib/supabase/server";

export async function getUserRole(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getUserRole error:", error.message);
    return null;
  }

  return data?.role ?? null;
}
