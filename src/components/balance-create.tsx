import { api } from "~/utils/api";

export const CreateBalanceForm: React.FC<{
    onSubmit: () => void;
}> = ({
    onSubmit,
}) => {
    const {
        data: currencies,
        error: currenciesError,
        isLoading: currenciesLoading,
    } = api.currency.getCurrencies.useQuery();
    const trpcUtils = api.useUtils();
    const {
        mutate: createBalance,
    } = api.balance.createBalance.useMutation({
        onSuccess: async () => {
            await trpcUtils.balance.getBalances.invalidate();
        }
    });
    
    if (currenciesLoading) {
        return <div>Loading...</div>;
    }

    if (currenciesError) {
        return <div>Error loading currencies</div>;
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
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={async (event) => {
                    event.preventDefault();
                    createBalance({
                        name: (document.getElementById("name") as HTMLInputElement).value,
                        value: Number((document.getElementById("value") as HTMLInputElement).value),
                        currencyId: (document.getElementById("currencyId") as HTMLSelectElement).value,
                    });
                    onSubmit();
                }}
            >
                Add balance
            </button>
            </form>
        </div>
    );
};