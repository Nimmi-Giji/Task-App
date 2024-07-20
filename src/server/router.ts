import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const serverRouter = t.router({
  findAll: t.procedure.query(async ({ ctx }) => {
    return ctx.prisma.taskList.findMany();
  }),
  insertOne: t.procedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.taskList.create({
        data: input,
      });
    }),
  updateOne: t.procedure
    .input(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().optional(),
      checked: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      return ctx.prisma.taskList.update({
        where: { id },
        data: rest,
      });
    }),
  deleteOne: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.taskList.delete({
        where: { id: input.id },
      });
    }),
  deleteAll: t.procedure
    .input(z.object({ ids: z.number().array() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.taskList.deleteMany({
        where: {
          id: { in: input.ids },
        },
      });
    }),
  deleteChecked: t.procedure
    .input(z.object({ ids: z.number().array() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.taskList.deleteMany({
        where: {
          id: { in: input.ids },
          checked: true,
        },
      });
    }),
});

export type ServerRouter = typeof serverRouter;
