import {
  getServerSession,
  type User,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import {
  login,
  loginGoogle,
} from "~/features/auth/api/auth"
import {
  type LoginUser,
  type LoginInput,
} from "~/features/auth/type/auth"

// Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
// object and keep type safety.
//
// @see https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: LoginUser
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends LoginUser {}
}

// Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//
// @see https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      credentials: {
      },
      async authorize(credentials) {
        try {
          const response = await login(credentials as LoginInput)

          if (!response.status || !response.data) {
            throw new Error("Tài khoản hoặc mật khẩu không đúng")
          }

          return response.data as unknown as User
        }
        catch (error) {
          throw new Error((error as Error).message || "Lỗi đăng nhập, vui lòng thử lại!")
        }
      },
    }),
  ],
  callbacks: {
    async session({
      token, session,
    }) {
      if (token && session.user) {
        session.user = token.user as LoginUser
      }
      return session
    },
    async jwt({
      token, user, trigger, session,
    }) {
      if (trigger === "signIn" && user) {
        Object.assign(
          token, user
        )
      }

      if (trigger === "update" && session) {
        Object.assign(
          token, session
        )
      }

      return token
    },
    async signIn({
      user, account,
    }) {
      if (account?.provider === "google") {
        const googleUser = await loginGoogle({
          name: user.name!,
          email: user.email!,
          googleId: user.id,
        })
        // if (!googleUser) return false

        Object.assign(
          user, googleUser
        ) // Cập nhật user trong session
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//
// @see https://next-auth.js.org/configuration/nextjs
export const getServerAuthSession = () =>
  getServerSession(authOptions)
