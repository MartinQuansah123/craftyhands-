import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/Home/layout";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import WhoWeSupport from "@/components/Home/WhoWeSupport";
import FAQ from "@/components/Home/FAQ";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout
      className={` ${inter.className}`}
    >
      <Hero/>
      <WhoWeSupport/>
      <Features/>
      
      <FAQ/>
    </Layout>
  );
}
