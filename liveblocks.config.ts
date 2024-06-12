import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVE_BLOCKS_PUBLIC_KEY!,
});

type Presence = {};
type Storage = {};
type UserMeta = {};
type RoomEvent = {};

export const {
    suspense: {
        RoomProvider,
        useRoom,
        useMyPresence,
        useUpdateMyPresence,
        useSelf,
        useOthers,
        useOthersMapped,
        useOthersConnectionIds,
        useOther,
        useBroadcastEvent,
        useEventListener,
        useErrorListener,
        useStorage,
        useObject,
        useMap,
        useList,
        useBatch,
        useHistory,
        useUndo,
        useRedo,
        useCanUndo,
        useCanRedo,
        useMutation,
        useCreateThread,
        useThreads
    },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
