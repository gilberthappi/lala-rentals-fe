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
					console.log(credentials);
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
			async profile(profile, tokens) {
				try {
 if (tokens.id_token) {
 await registerGoogleUser({ token: tokens.id_token });
} else {
 throw new Error("ID token is undefined");
 }
				} catch (error) {
 console.error("Error registering Google user:", error);
				}
				return {
id: profile.sub,
 name: profile.name,
 email: profile.email,
image: profile.picture,
				}; } 
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
