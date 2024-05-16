import { currencyRouter } from "~/server/api/routers/currency";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { balanceRouter } from "./routers/balance";
import { expenseRouter } from "./routers/expense";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  currency: currencyRouter,
  balance: balanceRouter,
  expense: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
