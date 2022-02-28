import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
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
        <div className="title text-6xl font-bold">birdbath</div>
        {session ? (
          <div className="rounded bg-blue-400 px-4 py-2 text-white mt-8">
            {session.data?.user!.name}
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="rounded bg-blue-400 px-4 py-2 text-white mt-8"
          >
            Login with Twitter
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
