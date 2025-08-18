import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// For demo: store hashed password here or better use env + DB.
// Hash for Admin@3390 (bcrypt salt 10) generated once.
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || ''; // optional hashed password
const ADMIN_PLAIN = process.env.ADMIN_PASSWORD || ''; // optional plain password (NOT recommended for production)

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if(!credentials) return null;
        const { username, password } = credentials as { username: string; password: string };
        if(username !== ADMIN_USER) return null;
        let ok = false;
        if(ADMIN_HASH && ADMIN_HASH.startsWith('$2')) {
          ok = await bcrypt.compare(password, ADMIN_HASH);
        } else if(ADMIN_PLAIN) {
          ok = password === ADMIN_PLAIN; // plain-text fallback
        }
        if(!ok) return null;
        return { id: 'admin-1', name: 'Admin', role: 'admin' };
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/admin' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if(user) (token as any).role = (user as any).role;
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      (session as any).role = (token as any).role;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET || 'dev-secret-change'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
