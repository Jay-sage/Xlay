import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabaseStatus: "healthy" | "unconfigured" | "degraded" = "unconfigured";

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });
      const { error } = await supabase
        .from("reserved_usernames")
        .select("username", { count: "exact", head: true });

      if (!error) {
        supabaseStatus = "healthy";
      } else {
        supabaseStatus = "degraded";
      }
    } catch {
      supabaseStatus = "degraded";
    }
  }

  return NextResponse.json(
    {
      status: "ok",
      service: "xlay-api",
      timestamp,
      uptime: Math.floor(uptime),
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: supabaseStatus,
        serviceRoleKeyConfigured: hasServiceKey,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
