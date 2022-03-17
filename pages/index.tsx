import { AuthButtons } from "components/AuthButtons";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

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
        <Link href={"/bath"}>
          <div className="title text-6xl font-bold">birdbath</div>
        </Link>
        <AuthButtons />
      </div>
    </div>
  );
};

export default Home;
