import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

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

	events: {
		async signIn({ user }) {
			console.log(user);
		},
	},

	pages: {
		verifyRequest: "/verify-email",
		signIn: "/login",
		signOut: "/logout",
		error: "/error",
	},
});
