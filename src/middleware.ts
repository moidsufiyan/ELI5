import { withAuth } from "next-auth/middleware"

// Wrap the middleware with NextAuth's official security layer
export default withAuth(
  function middleware(req) {
    // Custom logic can go here later if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/auth/signin', // Tells the middleware exactly where to bounce unauthorized links
    }
  }
)

// Explicitly target which routes should be physically impossible to visit without logging in
export const config = { 
  matcher: [
    "/simplify", 
    "/settings"
  ] 
}
