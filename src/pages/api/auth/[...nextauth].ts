import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  // Define authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'placeholder',
      clientSecret: process.env.GITHUB_SECRET || 'placeholder',
    }),
    // Custom Credentials for Demo or Email/Password Logging
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@eli5.ai" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Here you would connect to MongoDB and verify the user hash
        // For development Demo purposes:
        if (credentials?.email === "demo@eli5.ai" && credentials?.password === "password123") {
          return {
            id: "1",
            name: "Demo Admin",
            email: "demo@eli5.ai",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          }
        }
        
        // If query reaches backend verification and fails
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Add custom roles etc from database later
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'secret_placeholder_for_local_development',
}

export default NextAuth(authOptions)
