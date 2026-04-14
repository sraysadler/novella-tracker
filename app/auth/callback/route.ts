import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const userId = data.session.user.id;

      // Check if this user already has reading progress rows
      const { count } = await supabase
        .from("reading_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count === 0) {
        // First login — seed reading_progress with one row per book
        const { data: books } = await supabase
          .from("books")
          .select("id");

        if (books && books.length > 0) {
          const rows = books.map((book) => ({
            user_id: userId,
            book_id: book.id,
            status: "not_started" as const,
          }));

          await supabase.from("reading_progress").insert(rows);
        }
      }

      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Something went wrong — redirect to login
  return NextResponse.redirect(`${origin}/login`);
}
