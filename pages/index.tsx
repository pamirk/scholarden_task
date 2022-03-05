import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { parseCookies } from 'nookies';
import { redirectUser } from '../utils/auth';
import { App } from '../components/App';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>ScholarDen Task</title>
            </Head>
            <App />
        </div>
    );
};
Home.getInitialProps = async (ctx) => {
    const { token } = parseCookies(ctx);
    if (!token) redirectUser(ctx, '/login');
    return { token };
};
export default Home;
