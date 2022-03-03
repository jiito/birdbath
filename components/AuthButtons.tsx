import { signIn, signOut, useSession } from "next-auth/react";
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
        className="rounded bg-blue-400 px-4 py-2 text-white mt-8"
        onClick={() => signIn()}
      >
        Sign in with Twitter
      </button>
    </>
  );
};

const SignOut = ({ profilePic }: { profilePic: string }) => {
  return (
    <>
      <div
        className="flex rounded bg-blue-400 px-4 py-2 text-white cursor-pointer items-center"
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
