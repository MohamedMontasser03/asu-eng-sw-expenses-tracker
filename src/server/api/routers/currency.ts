import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const currencyRouter = createTRPCRouter({
  getCurrencies: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.currency.findMany();
  }),
});
