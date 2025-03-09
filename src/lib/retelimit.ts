import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "./redis";

const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export { rateLimit };
