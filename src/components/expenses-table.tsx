import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { CreateBalanceForm } from "./balance-create";
import { CreateExpenseForm } from "./expense-create";
import { DeleteExpenseForm } from "./expense-delete";

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
        "view" | "balanceCreateForm" | "expenseCreateForm" | `deleteExpenseForm-${string}`
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
                    <div className="flex justify-between">
                        <div>Name</div>
                        <div>Value</div>
                        <div>Currency</div>
                        <div>Actions</div>
                    </div>
                    {balances.map((balance) => (
                        <div key={balance.id} className="flex justify-between">
                            <div>{balance.name}</div>
                            <div>{balance.value}{balance.currency.symbol}</div>
                            <div>{balance.currency.name}</div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        console.log("edit balance");
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </button>
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
                        </div>
                    ))}
                </div>
            </div>
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
                    {expenses.length === 0 && <div>No expenses yet</div>}
                    {expenses.length > 0 && (
                        <div className="flex justify-between">
                            <div>Name</div>
                            <div>Value</div>
                            <div>Category</div>
                            <div>Actions</div>
                        </div>
                    )}
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between">
                            <div>{expense.name}</div>
                            <div>{expense.value}{expense.currency.symbol}</div>
                            <div>{expense.category.name}</div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        console.log("edit expense");
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setState(`deleteExpenseForm-${expense.id}`);
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                                {
                                    state === `deleteExpenseForm-${expense.id}` && (
                                        <DeleteExpenseForm
                                            expenseId={expense.id}
                                            onSubmit={() => {
                                                setState("view");
                                            }}
                                        />
                                    )
                                }
                                </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
