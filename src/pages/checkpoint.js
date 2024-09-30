import Layout from '@/components/Home/layout'
import UserCheckpoint from '@/components/UserCheckpoint'
import React from 'react'
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const checkpoint = () => {
  return (
    <Layout  className={` ${inter.className}`}>
        <UserCheckpoint/>
    </Layout>
  )
}

export default checkpoint