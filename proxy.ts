import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSessionlessPath } from "@/kernel/identity/sessionless-paths";

// Auth gate for the CRM. Everything under /admin needs a Supabase session;
// the login, reset and verify pages are sessionless. The marketing site is
// not matched at all.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isSessionlessPath(pathname)) return NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const toLogin = () => {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? response : toLogin();
  } catch {
    return toLogin();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
