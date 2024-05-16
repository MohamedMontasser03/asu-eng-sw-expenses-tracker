import Head from "next/head";
import { ExpensesTable } from "~/components/expenses-table";
import { Header } from "~/components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Expenses Tracker</title>
        <meta name="description" content="Track your expenses" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gray-900 text-white">
        <Header />
        <ExpensesTable />
      </main>
    </>
  );
}