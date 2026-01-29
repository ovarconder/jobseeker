import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth'
import { prisma } from './prisma'

interface LINEProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  email?: string
}

export function LINEProvider(options: OAuthUserConfig<LINEProfile>): OAuthConfig<LINEProfile> {
  return {
    id: 'line',
    name: 'LINE',
    type: 'oauth',
    authorization: {
      url: 'https://access.line.me/oauth2/v2.1/authorize',
      params: {
        response_type: 'code',
        client_id: options.clientId!,
        redirect_uri: options.callbackUrl || `${process.env.NEXTAUTH_URL}/api/auth/callback/line`,
        scope: 'profile openid email',
        state: 'random_state_string',
      },
    },
    token: {
      url: 'https://api.line.me/oauth2/v2.1/token',
      async request({ provider, params }) {
        const response = await fetch(provider.token?.url as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: params.code as string,
            redirect_uri: provider.callbackUrl || `${process.env.NEXTAUTH_URL}/api/auth/callback/line`,
            client_id: provider.clientId as string,
            client_secret: provider.clientSecret as string,
          }),
        })
        const tokens = await response.json()
        return { tokens }
      },
    },
    userinfo: {
      url: 'https://api.line.me/v2/profile',
      async request({ provider, tokens }) {
        const response = await fetch(provider.userinfo?.url as string, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
        return await response.json()
      },
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    async profile(profile) {
      // Get or create user from LINE profile
      const email = profile.email || `line_${profile.userId}@line.local`
      
      let user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        // Create new user with LINE login
        // Default to COMPANY role, can be changed later
        user = await prisma.user.create({
          data: {
            email,
            password: '', // No password for LINE login - we'll need to handle this
            name: profile.displayName,
            role: 'COMPANY', // Default role
            status: 'PENDING', // Need approval
          },
        })
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: profile.pictureUrl,
      }
    },
  }
}
