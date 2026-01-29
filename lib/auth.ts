import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserRole, UserStatus } from '@prisma/client'
import { LINEProvider } from './line-provider'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    ...(process.env.LINE_LOGIN_CHANNEL_ID && process.env.LINE_LOGIN_CHANNEL_SECRET
      ? [
          LINEProvider({
            clientId: process.env.LINE_LOGIN_CHANNEL_ID,
            clientSecret: process.env.LINE_LOGIN_CHANNEL_SECRET,
            callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/line`,
          }),
        ]
      : []),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = typeof credentials.email === 'string' ? credentials.email : null
        const password = typeof credentials.password === 'string' ? credentials.password : null

        if (!email || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { company: true },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // SEEKER role is auto-approved, others need approval
        if (user.status !== 'APPROVED' && user.role !== 'ADMIN' && user.role !== 'SEEKER') {
          throw new Error('Your account is pending approval')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.status = user.status
      }
      // For LINE login, fetch user from database to get role and status
      if (account?.provider === 'line' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.status = dbUser.status
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.status = token.status as UserStatus
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
})
