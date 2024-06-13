"use client";

import { Suspense } from "react";
import { useMaxZIndex } from "@/lib/useMaxZIndex";


import OverlayThread from "./OverlayThread";
import { useThreads } from "@/liveblocks.config";



export const CommentsOverlay = () => {
  /**
   * We're using the useThreads hook to get the list of threads
   * in the room.
   *
   * useThreads: https://liveblocks.io/docs/api-reference/liveblocks-react#useThreads
   */
  const { threads } = useThreads();

  // get the max z-index of a thread
  const maxZIndex = useMaxZIndex();

  return (
    <div>
      {threads
        .filter((thread) => !thread.metadata.resolved)
        .map((thread) => (
          <Suspense key={thread.id} fallback={null}>
            <OverlayThread thread={thread} maxZIndex={maxZIndex} />
          </Suspense>

        ))}
    </div>
  );
};

