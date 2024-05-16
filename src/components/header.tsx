import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Header = () => {
    const { data: sessionData } = useSession();
    return (
        <header className="flex flex-row items-center justify-between w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-white">
          Expenses Tracker
        </h1>
        <div className="flex flex-row items-center gap-4">
          {sessionData?.user?.image && (
            <Image
              src={sessionData.user.image}
              alt={sessionData.user.name ?? ""}
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
            />
          )}
          {sessionData && (
            <p className="text-xl text-white">{sessionData.user.name}</p>
          )}
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </header>
    );
};