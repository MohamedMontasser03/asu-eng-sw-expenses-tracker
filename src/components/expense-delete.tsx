import { api } from "~/utils/api";

export const DeleteExpenseForm: React.FC<{
    onSubmit: () => void;
    expenseId: string;
}> = ({
    onSubmit,
    expenseId
}) => {
    const trpcUtils = api.useUtils();
    const {
        mutate: deleteExpense,
    } = api.expense.deleteExpense.useMutation({
        onSuccess: async () => {
            await trpcUtils.balance.getBalances.invalidate();
            await trpcUtils.expense.getExpenses.invalidate();
        }
    });
    const {
        data: balances,
        error: balancesError,
        isLoading: balancesLoading,
    } = api.balance.getBalances.useQuery();
    
    if (balancesLoading) {
        return <div>Loading...</div>;
    }

    if (balancesError) {
        return <div>Error loading currencies</div>;
    }
    
    return (
        <div 
            className="text-white absolute top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onSubmit();
                }
            }}
        >
            <form className="flex flex-col items-center gap-4 bg-gray-800 p-4 rounded">
            <h2 className="text-white">Delete expense</h2>
            {/* ask if will refund */}
            <label className="text-white" htmlFor="refundBalanceId">
                Refund balance
            </label>
            <select
                id="refundBalanceId"
                name="refundBalanceId"
                className="rounded text-black"
            >
                <option value="">None</option>
                {balances?.map((balance) => (
                    <option key={balance.id} value={balance.id}>
                        {balance.name}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const refundBalanceId = (document.getElementById("refundBalanceId") as HTMLSelectElement).value;
                    deleteExpense({
                        id: expenseId,
                        refundBalanceId: refundBalanceId !== "" ? refundBalanceId : undefined,
                    });
                    
                    onSubmit();
                }}
            >
                Delete
            </button>
            </form>
        </div>
    );
};
