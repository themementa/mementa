import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * EMERGENCY PATCH: Hard stop redirect loops
 * 
 * This middleware prioritizes production stability over elegance.
 * All redirect logic is isolated here to prevent infinite loops.
 */

// STEP 1: Absolute public route whitelist (NON-NEGOTIABLE)
// These paths must NEVER trigger auth checks or redirects
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/intro",
  "/auth",
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/home",
  "/quotes",
  "/favorites",
  "/moments",
  "/settings",
  "/add-quote",
  "/quote",
  "/share",
  "/relationship",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // STEP 3: Emergency escape hatch - prevent infinite redirect loops
  if (request.headers.get("x-redirect-loop") === "1") {
    return NextResponse.next();
  }
  
  // STEP 1: Absolute public route whitelist - MUST execute BEFORE any auth logic
  // This check happens BEFORE reading session, cookies, or any redirect logic
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }
  
  // Also allow API routes without auth check
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  
  // STEP 2: Only check auth for specific protected routes
  // Only redirect if route is NOT public AND pathname starts with protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  
  if (!isProtectedRoute) {
    // Unknown route - allow through without auth check
    return NextResponse.next();
  }
  
  // For protected routes, check authentication
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // STEP 2: Disable redirect-on-uncertain-session
  // Only redirect if:
  // 1. User is NULL or UNDEFINED
  // 2. Route is protected (already checked above)
  // 3. Pathname starts with /home, /quotes, or /favorites (critical protected routes)
  if (!user && (pathname.startsWith("/home") || pathname.startsWith("/quotes") || pathname.startsWith("/favorites"))) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original pathname as a redirect parameter
    loginUrl.searchParams.set("redirect", pathname);
    
    // STEP 3: Set redirect loop guard header
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("x-redirect-loop", "1");
    return redirectResponse;
  }

  // User is authenticated OR route is not critical protected route - allow access
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

