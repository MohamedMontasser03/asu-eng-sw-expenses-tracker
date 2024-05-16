import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { CreateBalanceForm } from "./balance-create";

export const ExpensesTable = () => {
    const { data: sessionData } = useSession();
    const {
        data: balances,
        error: balancesError,
        isLoading: balancesLoading,
        refetch: refetchBalances,
        
    } = api.balance.getBalances.useQuery();
    const [state, setState] = useState<
        "view" | "balanceCreateForm"
    >("view");

    if (!sessionData) {
        return <div>Sign in to see your expenses</div>;
    }

    if (balancesLoading) {
        return <div>Loading...</div>;
    }

    if (balancesError ?? balances === undefined) {
        return <div>Error loading expenses</div>;
    }

    if (balances?.length === 0) {
        return (
            <div className="text-white w-full max-w-4xl mx-auto flex flex-col items-center">
                Looks like you don&#39;t have any balances yet.{" "}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        console.log("add balance");
                        setState("balanceCreateForm");
                    }}
                >
                    Add a balance
                </button>
                {state === "balanceCreateForm" && (
                    <CreateBalanceForm onSubmit={async () => {
                        await refetchBalances();
                        setState("view");
                    }} />
                )}
            </div>
        );
    }

    return (
        <div className="text-white w-full max-w-4xl mx-auto">
            <div className="flex justify-between flex-col gap-4 bg-gray-800 p-4 rounded">
                <h2>Your balances</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        console.log("add balance");
                        setState("balanceCreateForm");
                    }}
                >
                    Add a balance
                </button>

                {state === "balanceCreateForm" && (
                    <CreateBalanceForm onSubmit={async () => {
                        await refetchBalances();
                        setState("view");
                    }} />
                )}
                
                <div className="flex flex-col gap-4">
                    {balances.map((balance) => (
                        <div key={balance.id} className="flex justify-between">
                            <div>{balance.name}</div>
                            <div>{balance.value}{balance.currency.symbol}</div>
                            <div>{balance.currency.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
