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

	callbacks: {},

	events: {
		async signIn({ user, isNewUser }) {
			if (user.id) {
				await prisma.setting.create({
					data: {
						userId: user.id,
						companyName: "",
						companyEmail: user.email || "",
						currency: "USD",
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
