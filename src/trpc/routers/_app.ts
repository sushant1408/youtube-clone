import { categoriesRouter } from "@/modules/categories/server/procedures";
import { studioProcedure } from "@/modules/studio/server/procedures";
import { videoProcedure } from "@/modules/videos/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioProcedure,
  videos: videoProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
