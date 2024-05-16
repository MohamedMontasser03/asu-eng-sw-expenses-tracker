import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { CreateBalanceForm } from "./balance-create";
import { CreateExpenseForm } from "./expense-create";

export const ExpensesTable = () => {
    const { data: sessionData } = useSession();
    const {
        data: balances,
        error: balancesError,
        isLoading: balancesLoading,
    } = api.balance.getBalances.useQuery();
    const {
        data: expenses,
        error: expensesError,
        isLoading: expensesLoading,
    } = api.expense.getExpenses.useQuery();
    const trpcUtils = api.useUtils();
    const [state, setState] = useState<
        "view" | "balanceCreateForm" | "expenseCreateForm"
    >("view");
    const {
        mutate: deleteBalance,
    } = api.balance.deleteBalance.useMutation({
        onSuccess: async () => {
            await trpcUtils.balance.getBalances.invalidate();
        }
    });

    if (!sessionData) {
        return <div>Sign in to see your expenses</div>;
    }

    if (balancesLoading || expensesLoading) {
        return <div>Loading...</div>;
    }

    if (balancesError ?? expensesError ?? (!balances || !expenses)) {
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
                        setState("balanceCreateForm");
                    }}
                >
                    Add a balance
                </button>

                {state === "balanceCreateForm" && (
                    <CreateBalanceForm onSubmit={async () => {
                        setState("view");
                    }} />
                )}
                
                <div className="flex flex-col gap-4">
                    {balances.map((balance) => (
                        <div key={balance.id} className="flex justify-between">
                            <div>{balance.name}</div>
                            <div>{balance.value}{balance.currency.symbol}</div>
                            <div>{balance.currency.name}</div>
                            <button
                                onClick={async () => {
                                    deleteBalance({
                                        id: balance.id,
                                    });
                                    setState("view");
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* show expenses */}
            <div className="flex justify-between flex-col gap-4 bg-gray-800 p-4 rounded mt-4">
                <h2>Your expenses</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setState("expenseCreateForm");
                    }}
                >
                    Add an expense
                </button>

                {state === "expenseCreateForm" && (
                    <CreateExpenseForm onSubmit={() => {
                        setState("view");
                    }} />
                )}

                <div className="flex flex-col gap-4">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between">
                            <div>{expense.name}</div>
                            <div>{expense.value}{expense.currency.symbol}</div>
                            <div>{expense.category.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

