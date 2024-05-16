import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const balanceRouter = createTRPCRouter({
  getBalances: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.balance.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
  }),
});
