"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PlaylistsSection } from "@/modules/playlists/ui/sections/playlists-section";
import { PlaylistCreateModal } from "../components/playlist-create-modal";

const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal
        onOpenChange={setCreateModalOpen}
        open={createModalOpen}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-muted-foreground">
            Collections you have created
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCreateModalOpen(true)}
          className="rounded-full"
        >
          <PlusIcon />
        </Button>
      </div>

      <PlaylistsSection />
    </div>
  );
};

export { PlaylistsView };
