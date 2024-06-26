import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const expenseRouter = createTRPCRouter({
  getExpenses: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.expense.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        currency: true,
        category: true,
      },
    })
  }),
  getExpensesCategories: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.expenseCategory.findMany()
  }),
  createExpense: protectedProcedure.input(
    z.object({
      name: z.string().min(1),
      value: z.number().min(0),
      currencyId: z.string().min(1),
      categoryName: z.string().min(1).optional(),
      categoryId: z.string().min(1).optional(),
      balanceId: z.string().min(1).optional(),
      date: z.string().min(1),
    }),
  ).mutation(async ({ ctx, input }) => {
    if (input.categoryName && !input.categoryId) {
      const category = await ctx.db.expenseCategory.create({
        data: {
          name: input.categoryName,
        },
      });
      input.categoryId = category.id;
    }
    if (!input.categoryId) {
      throw new Error("Category is required");
    }
    const balance = await ctx.db.balance.findUnique({
      where: {
        id: input.balanceId,
        userId: ctx.session.user.id,
      },
    });
    if (!balance) {
      throw new Error("Balance not found");
    }
    if (balance.value < input.value) {
      throw new Error("Insufficient funds");
    }
    if (balance.currencyId !== input.currencyId) {
      throw new Error("Currency mismatch");
    }
    await ctx.db.balance.update({
      where: {
        id: input.balanceId,
      },
      data: {
        value: {
          decrement: input.value,
        },
      },
    });
    return ctx.db.expense.create({
      data: {
        name: input.name,
        value: input.value,
        currencyId: input.currencyId,
        categoryId: input.categoryId,
        userId: ctx.session.user.id,
        date: input.date,
      },
    })
  }),
  deleteExpense: protectedProcedure.input(
    z.object({
      id: z.string().min(1),
      refundBalanceId: z.string().optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const expense = await ctx.db.expense.findUnique({
      where: {
        id: input.id,
        userId: ctx.session.user.id,
      },
    });
    if (!expense) {
      throw new Error("Expense not found");
    }
    if (input.refundBalanceId) {
      const balance = await ctx.db.balance.findUnique({
        where: {
          id: input.refundBalanceId,
          userId: ctx.session.user.id,
        },
      });
      if (!balance) {
        throw new Error("Balance not found");
      }
      if (balance.currencyId !== expense.currencyId) {
        throw new Error("Currency mismatch");
      }
      await ctx.db.balance.update({
        where: {
          id: input.refundBalanceId,
        },
        data: {
          value: {
            increment: expense.value,
          },
        },
      });
    }
    return ctx.db.expense.delete({
      where: {
        id: input.id,
      },
    })
  }),
});
