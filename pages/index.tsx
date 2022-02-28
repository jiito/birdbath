import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

const Home: NextPage = () => {
  const session = useSession();
  return (

    <div className="container mx-auto">

      <Head>
        <title>birdbath</title>
        <meta
          name="description"
          content="Give your twitter a spring cleaning"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center mt-52">
        <div className="title text-2xl">birdbath</div>
      </div>

    </div>
  );
};

export default Home;
