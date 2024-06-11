'use client';

import React, { useCallback, useEffect, useState } from 'react';

import LiveCursor from './cursor/LiveCursor';
import { useMyPresence, useOthers } from '@/liveblocks.config';
import CursorChat from './cursor/CursorChat';
import { CursorMode } from '@/types/type';

const Live = () => {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState({ mode: CursorMode.Hidden });
    useEffect(() => {
        const onKeyUp = (e: React.KeyboardEvent) => {
            if (e.key === '/') {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: '',
                });
            } else if (e.key === 'Escape') {
                updateMyPresence({ message: '' });
                setCursorState({
                    mode: CursorMode.Hidden,
                });
            }
        };
        const onKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: '',
                });
            } else if (e.key === 'Escape') {
                updateMyPresence({ message: '' });
                setCursorState({
                    mode: CursorMode.Hidden,
                });
            }
        };

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [updateMyPresence]);
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
            setCursorState({ mode: CursorMode.Hidden });
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
            <h1 className="text-5xl text-white">Live block figma clone</h1>
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            <LiveCursor others={others} />
        </div>
    );
};

export default Live;
