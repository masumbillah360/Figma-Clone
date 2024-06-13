'use client'

import { useCallback, useRef } from "react";

import { ThreadMetadata, useEditThreadMetadata } from "@/liveblocks.config";
import { PinnedThread } from "./PinnedThread";

import { ThreadData } from "@liveblocks/client";

type OverlayThreadProps = {
    thread: ThreadData<ThreadMetadata>;
    maxZIndex: number;
};

const OverlayThread = ({ thread, maxZIndex }: OverlayThreadProps) => {
    /**
     * We're using the useEditThreadMetadata hook to edit the metadata
     * of a thread.
     *
     * useEditThreadMetadata: https://liveblocks.io/docs/api-reference/liveblocks-react#useEditThreadMetadata
     */
    const editThreadMetadata = useEditThreadMetadata();

    /**
     * We're using the useUser hook to get the user of the thread.
     *
     * useUser: https://liveblocks.io/docs/api-reference/liveblocks-react#useUser
     */
 
    // // We're using a ref to get the thread element to position it
    const threadRef = useRef<HTMLDivElement>(null);

    // // // If other thread(s) above, increase z-index on last element updated
    const handleIncreaseZIndex = useCallback(() => {
        if (maxZIndex === thread.metadata.zIndex) {
            return;
        }

        // Update the z-index of the thread in the room
        editThreadMetadata({
            threadId: thread.id,
            metadata: {
                zIndex: maxZIndex + 1,
            },
        });
    }, [thread, editThreadMetadata, maxZIndex]);

    return (
        <div
            ref={threadRef}
            id={`thread-${thread.id}`}
            className="absolute left-0 top-0 flex gap-5"
            style={{
                transform: `translate(${thread.metadata.x}px, ${thread.metadata.y}px)`,
            }}
        >
            {/* render the thread */}
            {/* <div>Hello</div> */}
            <PinnedThread thread={thread} onFocus={handleIncreaseZIndex} />
        </div>
    );
};


export default OverlayThread;