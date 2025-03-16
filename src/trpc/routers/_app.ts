import { categoriesRouter } from "@/modules/categories/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { studioRouter } from "@/modules/studio/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { videoRouter } from "@/modules/videos/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videoRouter,
  videosViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subsctions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
