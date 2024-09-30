import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Home/layout";
import UserSignin from "@/components/UserSignin";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  return (
    <Layout
      className={` ${inter.className}`}
    >
      <UserSignin/>
    </Layout>
  );
}
