import React, { useCallback } from 'react';

import LiveCursor from './cursor/LiveCursor';
import { useMyPresence, useOthers } from '@/liveblocks.config';

const Live = () => {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;

    const handlePointerMove = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();

            const x =
                event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y =
                event.clientY - event.currentTarget.getBoundingClientRect().y;
            updateMyPresence({ cursor: { x, y } });
        },
        [updateMyPresence]
    );

    const handlePointerLeave = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();
            updateMyPresence({ cursor: null, message: null });
        },
        [updateMyPresence]
    );

    const handlePointerDown = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();

            const x =
                event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y =
                event.clientY - event.currentTarget.getBoundingClientRect().y;
            updateMyPresence({ cursor: { x, y } });
        },
        [updateMyPresence]
    );

    return (
        <div
            className="h-screen w-full flex justify-center items-center"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}>
            <LiveCursor others={others} />
        </div>
    );
};

export default Live;
