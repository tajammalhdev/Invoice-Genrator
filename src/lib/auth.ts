import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),

	providers: [
		Nodemailer({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
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
