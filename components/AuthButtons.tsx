import { signIn, signOut, useSession } from "next-auth/react";
import { FiTwitter } from "react-icons/fi";
import Image from "next/image";

export const AuthButtons = () => {
  const session = useSession();
  return (
    <>
      {session.data?.user ? (
        <SignOut profilePic={session.data.user.image!} />
      ) : (
        <SignIn />
      )}
    </>
  );
};

const SignIn = () => {
  return (
    <>
      <button
        className="flex items-center px-4 py-2 mt-8 space-x-2 text-white bg-blue-400 rounded"
        onClick={() => signIn("twitter")}
      >
        <FiTwitter />
        <span>Sign in with Twitter</span>
      </button>
    </>
  );
};

const SignOut = ({ profilePic }: { profilePic: string }) => {
  return (
    <>
      <div
        className="flex items-center px-4 py-2 text-white bg-blue-400 rounded cursor-pointer"
        onClick={() => signOut()}
      >
        <Image
          src={profilePic}
          width={25}
          height={25}
          layout="fixed"
          className="rounded-full "
        />
        <span className="ml-2">Sign out</span>
      </div>
    </>
  );
};
