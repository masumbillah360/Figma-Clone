'use client';

import React, { useCallback, useEffect, useState } from 'react';

import LiveCursor from './cursor/LiveCursor';
import { useMyPresence, useOthers } from '@/liveblocks.config';
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction } from '@/types/type';
import ReactionSelector from './reaction/ReactionSelector';

const Live = () => {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    });
    const [reaction, setReaction] = useState<Reaction[]>([]);
    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
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
            } else if (e.key === 'e') {
                setCursorState({
                    mode: CursorMode.ReactionSelector,
                });
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
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
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [updateMyPresence]);
    const handlePointerMove = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();
            if (
                cursor === null ||
                cursorState.mode !== CursorMode.ReactionSelector
            ) {
                const x =
                    event.clientX -
                    event.currentTarget.getBoundingClientRect().x;
                const y =
                    event.clientY -
                    event.currentTarget.getBoundingClientRect().y;
                updateMyPresence({ cursor: { x, y } });
            }
        },
        [updateMyPresence, cursor, cursorState.mode]
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
            setCursorState((state: CursorState) =>
                cursorState.mode === CursorMode.Reaction
                    ? { ...state, isPressed: true }
                    : state
            );
        },
        [updateMyPresence, cursorState.mode]
    );

    const handlePointerUp = useCallback(() => {
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction
                ? { ...state, isPressed: false }
                : state
        );
    }, [cursorState.mode]);

    const setReactions = useCallback((reaction: string) => {
        setCursorState({
            mode: CursorMode.Reaction,
            reaction,
            isPressed: false,
        });
    }, []);
    return (
        <div
            className="h-screen w-full flex justify-center items-center"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}>
            <h1 className="text-5xl text-white">Live block figma clone</h1>
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            {cursorState.mode === CursorMode.ReactionSelector && (
                <ReactionSelector setReaction={setReactions} />
            )}
            <LiveCursor others={others} />
        </div>
    );
};

export default Live;
