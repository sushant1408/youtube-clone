import { ReactNode } from "react";

import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <StudioLayout>{children}</StudioLayout>;
}
