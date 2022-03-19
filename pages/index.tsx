import { AuthButtons } from "components/AuthButtons";
import Layout from "components/Layout";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();
  return (
    <Layout>
      <div className="container mx-auto ">
        <Head>
          <title>birdbath</title>
          <meta
            name="description"
            content="Give your twitter a spring cleaning"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex flex-col items-center space-y-10 mt-52 ">
          <div className="text-6xl font-bold text-gray-100 title">
            Your account{" "}
            <span className="text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text">
              sucks
            </span>
          </div>
          <div className="text-6xl font-bold text-gray-100 title">
            Your tweets are old as{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
              $*%$
            </span>
          </div>

          <Link href={"/bath"}>
            <button className="p-4 text-gray-100 border border-gray-100 rounded">
              Give your twitter a bath
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
