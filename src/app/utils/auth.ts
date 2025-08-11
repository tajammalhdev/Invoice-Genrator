import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "../../lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { defaultSettings } from "./types";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),

	providers: [
		Nodemailer({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	events: {
		async createUser({ user }) {
			if (!user.id) return;
			await prisma.setting.create({
				data: {
					...defaultSettings,
					companyEmail: user.email ?? defaultSettings.companyEmail,
					userId: user.id,
				},
			});
		},
	},
	pages: {
		verifyRequest: "/verify", // 👈 your custom page
	},
});
