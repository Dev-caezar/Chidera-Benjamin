import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export const {handlers, auth, signIn, signOut} = NextAuth({
    session: {strategy: "jwt"},
    pages: {signIn: "/admin/login"},
    providers: [
        Credentials({
            credentials: {email: {}, password: {}},
            async authorize(credentials) {
                const email = String(credentials?.email ?? "").toLowerCase();
                const password = String(credentials?.password ?? "");
                console.log("Missing email or password");
                if (!email || !password) {
                    return null
                }

                await connectDB();
                const user = await User.findOne({email});
                console.log("No user found for:", email);
                if (!user) {
                    return null
                }

                const valid = await bcrypt.compare(password, user.password)
                 console.log("Password valid?", valid);
                if (!valid) {
                    return null
                }
                return {id: user._id.toString(), email: user.email}
            }
        })
    ]
})