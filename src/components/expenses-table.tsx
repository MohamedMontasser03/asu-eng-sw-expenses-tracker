import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export const ExpensesTable = () => {
    const { data: sessionData } = useSession();
    const {
        data: balances,
        error: balancesError,
        isLoading: balancesLoading,
    } = api.balance.getBalances.useQuery();

    if (!sessionData) {
        return <div>Sign in to see your expenses</div>;
    }

    if (balancesLoading) {
        return <div>Loading...</div>;
    }

    if (balancesError) {
        return <div>Error loading expenses</div>;
    }

    if (balances?.length === 0) {
        return (
            <div className="text-white w-full max-w-4xl mx-auto flex flex-col items-center">
                Looks like you don&#39;t have any balances yet.{" "}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add a balance
                </button>
            </div>
        );
    }

    return (
        <div className="text-white w-full max-w-4xl mx-auto">
            Hi {balances?.length}
        </div>
    );
};