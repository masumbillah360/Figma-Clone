'use client';

import { useEffect, useRef, useState } from 'react';

import { fabric } from 'fabric';

import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import LeftSideBar from '@/components/LeftSideBar';
import RightSideBar from '@/components/RightSideBar';
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasObjectModified, handleResize, initializeFabric, renderCanvas } from '@/lib/canvas';
import { ActiveElement } from '@/types/type';
import { useMutation, useStorage } from '@/liveblocks.config';
import { defaultNavElement } from '@/constants';
import { handleDelete } from '@/lib/key-events';

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null)
    const isDrawing = useRef<boolean>(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>(null)
    const activeObjectRef = useRef<fabric.Object | null>(null)


    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: ""
    })

    const canvasObjects = useStorage((root) => root.canvasObjects);
    const syncShapeInStorage = useMutation(({ storage }, object) => {
        if (!object) return

        const { objectId } = object;
        const shapeData = object.toJSON();
        shapeData.objectId = objectId;

        const canvasObjects = storage.get('canvasObjects');
        canvasObjects.set(objectId, shapeData);

    }, [])

    const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
        const canvasObjects = storage.get('canvasObjects');
        canvasObjects.delete(shapeId);

    }, [])
    const deleteAllShapes = useMutation(({ storage }) => {
        const canvasObjects = storage.get('canvasObjects');
        if (!canvasObjects || canvasObjects.size === 0) {
            return true
        }
        for (const [key, value] of canvasObjects.entries()) {
            canvasObjects.delete(key);
        }
        return canvasObjects.size === 0;
    }, [])
    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem);
        switch (elem?.value) {
            case "reset":
                deleteAllShapes()
                fabricRef.current?.clear()
                setActiveElement(defaultNavElement)
                break;

            case 'delete':
                handleDelete(fabricRef.current as any, deleteShapeFromStorage)
                setActiveElement(defaultNavElement)
                break;
            default:
                break;
        }
        selectedShapeRef.current = elem?.value as string;
    }

    useEffect(() => {
        const canvas = initializeFabric({
            canvasRef, fabricRef
        })
        canvas.on('mouse:down', (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                isDrawing,
                selectedShapeRef,
                shapeRef
            })
        })
        canvas.on('mouse:move', (options) => {
            handleCanvasMouseMove({
                options,
                canvas,
                isDrawing,
                selectedShapeRef,
                shapeRef,
                syncShapeInStorage
            })
        })
        canvas.on('mouse:up', (options) => {
            handleCanvasMouseUp({
                canvas,
                isDrawing,
                selectedShapeRef,
                shapeRef,
                syncShapeInStorage,
                setActiveElement,
                activeObjectRef
            })
        })

        canvas.on('object:modified', (options) => {
            handleCanvasObjectModified({
                options,
                syncShapeInStorage,
            })
        })

        window.addEventListener('resize', () => {
            handleResize({
                canvas: fabricRef.current
            })
        })
        return () => {
            canvas.dispose()
        }
    }, [])

    useEffect(() => {
        renderCanvas({
            activeObjectRef,
            fabricRef,
            canvasObjects
        })
    }, [canvasObjects])
    return (
        <>
            <main className="h-screen overflow-hidden">
                <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement} />
                <section className="flex h-full flex-row">
                    <LeftSideBar />
                    <Live canvasRef={canvasRef} />
                    <RightSideBar />
                </section>
            </main>
        </>
    );
}
