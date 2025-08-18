import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

interface AdminUser { id: string; name: string; role: 'admin'; }
interface AdminToken extends JWT { role?: 'admin'; }

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PLAIN = process.env.ADMIN_PASSWORD || '';

const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<AdminUser | null> {
        if(!credentials) return null;
        const { username, password } = credentials as { username: string; password: string };
        if(username !== ADMIN_USER) return null;
        let ok = false;
        if(ADMIN_HASH && ADMIN_HASH.startsWith('$2')) {
          ok = await bcrypt.compare(password, ADMIN_HASH);
        } else if(ADMIN_PLAIN) {
          ok = password === ADMIN_PLAIN;
        }
        if(!ok) return null;
        return { id: 'admin-1', name: 'Admin', role: 'admin' };
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin' },
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AdminToken;
      if(user) t.role = (user as AdminUser).role;
      return t;
    },
    async session({ session, token }): Promise<Session> {
      // Augment session with role while keeping original shape
      (session as Session & { role?: string }).role = (token as AdminToken).role;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET || 'dev-secret-change'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
