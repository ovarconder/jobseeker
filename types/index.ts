import { UserRole, UserStatus, JobStatus, ApplicationStatus, JobType, NotificationType } from '@prisma/client'

export type { UserRole, UserStatus, JobStatus, ApplicationStatus, JobType, NotificationType }

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      status: UserStatus
    }
  }

  interface User {
    role: UserRole
    status: UserStatus
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    status: UserStatus
  }
}
