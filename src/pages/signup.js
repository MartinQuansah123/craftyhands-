import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Home/layout";
import UserSignup from "@/components/UserSignup";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  return (
    <Layout
      className={` ${inter.className}`}
    >
      <UserSignup/>
    </Layout>
  );
}
