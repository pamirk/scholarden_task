import type {NextPage} from 'next'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {parseCookies} from "nookies";
import {redirectUser} from "../utils/auth";
import {Demo} from "../components/Demo";


const Home: NextPage = () => {


    return (
        <div className={styles.container}>
            <Head>
                <title>Demo Project</title>
            </Head>

            <Demo/>


            <main className={styles.main}>

                {/*  <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <p className={styles.description}>
                    Get started by editing{' '}
                    <code className={styles.code}>pages/index.tsx</code>
                </p>*/}

                <div className={styles.grid}>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
                </a>
            </footer>
        </div>
    )
}
Home.getInitialProps = async (ctx) => {
    const {token} = parseCookies(ctx)
    if (!token) redirectUser(ctx, "/login")
    return {token}
}
export default Home
