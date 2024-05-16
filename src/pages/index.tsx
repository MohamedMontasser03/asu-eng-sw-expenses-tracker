import Head from "next/head";
import { Header } from "~/components/header";

export default function Home() {

  return (
    <>
      <Head>
        <title>Expenses Tracker</title>
        <meta name="description" content="Track your expenses" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Header />
      </main>
    </>
  );
}