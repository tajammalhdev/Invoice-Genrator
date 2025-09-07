import NextAuth, { DefaultSession } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			firstName: string;
			lastName: string;
			currency: string;
		} & DefaultSession["user"];
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),

	providers: [
		Nodemailer({
			server: {
				host: process.env.SMTP_HOST!,
				port: parseInt(process.env.SMTP_PORT || "587"),
				auth: {
					user: process.env.SMTP_USER!,
					pass: process.env.SMTP_PASS!,
				},
				secure: process.env.SMTP_SECURE === "true",
			},
			from: process.env.SMTP_FROM!,
		}),
	],

	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.firstName = (user as any)?.firstName;
				token.lastName = (user as any)?.lastName;
				token.currency = (user as any)?.currency;
			}
			return token;
		},
		session: ({ session, user }) => {
			if (session.user) {
				session.user.id = user.id;
				session.user.firstName = user.firstName;
				session.user.lastName = user.lastName;
				session.user.currency = user.currency;
			}
			return session;
		},
	},

	events: {
		async signIn({ user, isNewUser }) {
			// If it's a new user, set default values
			if (isNewUser) {
				await prisma.user.update({
					where: { id: user.id },
					data: {
						currency: "USD", // Set default currency for new users
					},
				});
			}
		},
	},

	pages: {
		verifyRequest: "/verify-email",
		signIn: "/login",
		signOut: "/logout",
		error: "/error",
	},
});
