import { ReactNode } from "react";

import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>;
}
