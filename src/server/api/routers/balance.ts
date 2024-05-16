import { z } from "zod";
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
      include: {
        currency: true,
      },
    })
  }),
  createBalance: protectedProcedure.input(
    z.object({
      name: z.string().min(1),
      value: z.number().min(0),
      currencyId: z.string().min(1),
    }),
  ).mutation(async ({ ctx, input }) => {
    return ctx.db.balance.create({
      data: {
        name: input.name,
        value: input.value,
        currencyId: input.currencyId,
        userId: ctx.session.user.id,
        date: (new Date()).toISOString(),
      },
    })
  }),
  deleteBalance: protectedProcedure.input(
    z.object({
      id: z.string().min(1),
    }),
  ).mutation(async ({ ctx, input }) => {
    return ctx.db.balance.delete({
      where: {
        id: input.id,
      },
    });
  }),
});
