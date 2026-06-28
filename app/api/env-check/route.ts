import { NextResponse } from "next/server";

export async function GET() {
  const check = (name: string) => {
    const v = process.env[name];
    return { present: !!v, length: v ? v.length : 0 };
  };
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: check("NEXT_PUBLIC_SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: check("SUPABASE_SERVICE_ROLE_KEY"),
    RESEND_API_KEY: check("RESEND_API_KEY"),
  });
}
