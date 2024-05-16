import { api } from "~/utils/api";

export const CreateExpenseForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const {
        data: currencies,
        error: currenciesError,
        isLoading: currenciesLoading,
    } = api.currency.getCurrencies.useQuery();
    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesLoading,
    } = api.expense.getExpensesCategories.useQuery();
    const {
        data: balances,
        error: balancesError,
        isLoading: balancesLoading,
    } = api.balance.getBalances.useQuery();
    const trpcUtils = api.useUtils();
    const {
        mutate: createExpense,
    } = api.expense.createExpense.useMutation({
        onSuccess: async () => {
            await trpcUtils.expense.getExpenses.invalidate();
        }
    });

    if (currenciesLoading || categoriesLoading || balancesLoading) {
        return <div>Loading...</div>;
    }

    if (currenciesError ?? categoriesError ?? balancesError) {
        return <div>Error loading currencies or categories</div>;
    }

    return (
        <div className="text-white absolute top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <form className="flex flex-col items-center gap-4 bg-gray-800 p-4 rounded">
                <label className="text-white" htmlFor="name">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="rounded text-black"
                />
                <label className="text-white" htmlFor="value">
                    Value
                </label>
                <input
                    type="number"
                    id="value"
                    name="value"
                    className="rounded text-black"
                />
                <label className="text-white" htmlFor="balanceId">
                    Balance
                </label>
                <select
                    id="balanceId"
                    name="balanceId"
                    className="rounded text-black"
                >
                    {balances?.map((balance) => (
                        <option key={balance.id} value={balance.id}>
                            {balance.name}
                        </option>
                    ))}
                </select>
                <label className="text-white" htmlFor="currencyId">
                    Currency
                </label>
                <select
                    id="currencyId"
                    name="currencyId"
                    className="rounded text-black"
                >
                    {currencies?.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                            {currency.name}
                        </option>
                    ))}
                </select>
                <label className="text-white" htmlFor="category">
                    Category
                </label>
                {/* category is an input with autocomplete for existing categories */}
                <input
                    type="text"
                    id="category"
                    name="category"
                    className="rounded text-black"
                    list="categories"
                />
                <datalist id="categories">
                    {categories?.map((category) => (
                        <option key={category.id} value={category.name} />
                    ))}
                </datalist>
                <label className="text-white" htmlFor="date">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="rounded text-black"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async (event) => {
                        event.preventDefault();
                        const name = (document.getElementById("name") as HTMLInputElement).value;
                        const value = Number((document.getElementById("value") as HTMLInputElement).value);
                        const currencyId = (document.getElementById("currencyId") as HTMLSelectElement).value;
                        const categoryName = (document.getElementById("category") as HTMLInputElement).value;
                        const date = (document.getElementById("date") as HTMLInputElement).value;
                        const balanceId = (document.getElementById("balanceId") as HTMLSelectElement).value;
                        const data: {
                            name: string;
                            value: number;
                            currencyId: string;
                            categoryName?: string;
                            categoryId?: string;
                            balanceId: string;
                            date: string;
                        } = {
                            name,
                            value,
                            balanceId,
                            currencyId,
                            date: new Date(date).toISOString(),
                        };

                        if (categoryName) {
                            const category = categories?.find((category) => category.name === categoryName);
                            if (category) {
                                data.categoryId = category.id;
                            } else {
                                data.categoryName = categoryName;
                            }
                        }

                        createExpense(data);
                        console.log("create expense");
                        onSubmit();
                    }}
                >
                    Add expense
                </button>
            </form>
        </div>
    );
};