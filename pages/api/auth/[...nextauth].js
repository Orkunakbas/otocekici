import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('NextAuth: Giriş denemesi', credentials?.email);
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!response.ok) {
            console.error('NextAuth: Giriş başarısız', response.status);
            return null;
          }

          const userData = await response.json();
          
          if (!userData?.token) {
            console.error('NextAuth: Token bulunamadı');
            return null;
          }

          console.log('NextAuth: Giriş başarılı, token alındı');
          
          return {
            user_id: userData.user_id,
            fullname: userData.fullname,
            email: userData.email,
            role: userData.role,
            token: userData.token,
            companies: userData.companies || []
          };
        } catch (err) {
          console.error('NextAuth authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      // Sadece ilk giriş yapıldığında user objesi dolu gelir
      if (user) {
        console.log('NextAuth: Token JWT\'ye kaydediliyor');
        token.accessToken = user.token;
        token.user_id = user.user_id;
        token.fullname = user.fullname;
        token.email = user.email;
        token.role = user.role;
        token.companies = user.companies;
      }
      return token;
    },
    async session({ session, token }) {
      // Session'a token bilgilerini ekle
      session.accessToken = token.accessToken;
      
      // User bilgilerini ekle
      session.user = {
        id: token.user_id,
        name: token.fullname,
        email: token.email,
        role: token.role,
        companies: token.companies
      };
      
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log('NextAuth: Kullanıcı giriş yaptı', user.email);
    },
    async signOut() {
      console.log('NextAuth: Kullanıcı çıkış yaptı');
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}) 