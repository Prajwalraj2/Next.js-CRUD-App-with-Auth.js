import { auth } from "@/auth"
 
export default auth((req: any) => {
  // Extract the pathname from the request
  const { pathname } = req.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',           // Home page
    '/products',   // Product listing page (view only)
    '/login',      // Login page
    '/register',   // Register page
  ];
  
  // Always allow NextAuth API routes
  if (pathname.startsWith('/api/auth')) {
    return;
  }
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // If it's a public route, allow access regardless of auth status
  if (isPublicRoute) {
    return;
  }

  // Check if the user is an admin
  // if (req.auth?.user?.role !== "ADMIN") {
  //   const newUrl = new URL("/", req.nextUrl.origin)
  //   return Response.redirect(newUrl)
  // }

    // Admin-only
    if (pathname.startsWith("/admin")) {
      const role = req.auth?.token?.role || req.auth?.user?.role;
      if (role !== "ADMIN") return new Response("Forbidden", { status: 403 });
      return;
    }
  
  // Check if it's a protected route pattern
  const isProtectedRoute = 
    pathname.startsWith('/products/new') ||
    pathname.match(/^\/products\/\d+\/edit$/) ||  // Match /products/{id}/edit
    pathname.startsWith('/user') ||
    pathname.startsWith('/myproducts');
  
  // For protected routes, require authentication
  if (isProtectedRoute && !req.auth) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
