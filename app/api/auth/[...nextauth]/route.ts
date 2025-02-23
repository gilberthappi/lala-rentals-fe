import { signIn, registerGoogleUser } from "@/services/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "email", placeholder: "me@domain.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					return (await signIn({
						password: credentials?.password,
						email: credentials?.email,
					})) as any;
				} catch (error: any) {
					throw new Error(error.response?.data?.message ?? error);
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			},
			async profile(profile, tokens): Promise<any> {
				try {
					if (tokens.id_token) {
						const response = await registerGoogleUser({ token: tokens.id_token });
						const user = response;
						return {
							token: user.token,
							id: user.id,
							name: `${user.firstName} ${user.lastName}`,
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							roles: user.roles[0],
							image: profile.picture,
						};
					} else {
						throw new Error("ID token is undefined");
					}
				} catch (error) {
					console.error("Error registering Google user:", error);
					return null;
				}
			}
		}),
	],
	callbacks: {
		signIn(data) {
			return !!data.user.id;
		},
		async session({ session, token }) {
			return { ...session, ...token };
		},
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
});

export { handler as GET, handler as POST };
