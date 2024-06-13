'use client';

import { useEffect, useRef, useState } from 'react';

import { fabric } from 'fabric';

import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import RightSideBar from '@/components/RightSideBar';
import { handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated, handleResize, initializeFabric, renderCanvas } from '@/lib/canvas';
import { ActiveElement, Attributes } from '@/types/type';
import { useMutation, useRedo, useStorage, useUndo } from '@/liveblocks.config';
import { defaultNavElement } from '@/constants';
import { handleDelete, handleKeyDown } from '@/lib/key-events';
import LeftSidebar from '@/components/LeftSidebar';
import { handleImageUpload } from '@/lib/shapes';

export default function Page() {
    const undo = useUndo();
    const redo = useRedo();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null)
    const isDrawing = useRef<boolean>(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>(null)

    const activeObjectRef = useRef<fabric.Object | null>(null)

    const imageInputRef = useRef<HTMLInputElement>(null);
    const isEditingRef = useRef<boolean>(false);



    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: ""
    })

    const [elementAttributes, setElementAttributes] = useState<Attributes>({
        width: "",
        height: "",
        fontSize: "",
        fontFamily: "",
        fontWeight: "",
        fill: "#aabbcc",
        stroke: "#aabbcc"
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
            case 'image':
                imageInputRef.current?.click()
                isDrawing.current = false
                if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = false
                }
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
        canvas.on('mouse:up', () => {
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

        canvas.on('object:scaling', (options) => {
            handleCanvasObjectScaling({
                options,
                setElementAttributes
            })
        })

        canvas.on('selection:created', (options) => {
            handleCanvasSelectionCreated({
                options,
                isEditingRef,
                setElementAttributes,
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

    window.addEventListener('keydown', (e) => {
        handleKeyDown({
            e,
            canvas: fabricRef.current,
            undo,
            redo,
            syncShapeInStorage,
            deleteShapeFromStorage
        })
    })

    useEffect(() => {
        renderCanvas({
            activeObjectRef,
            fabricRef,
            canvasObjects
        })
    }, [canvasObjects])
    return (

        <main className="h-screen overflow-hidden">
            <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement} imageInputRef={imageInputRef} handleImageUpload={(e) => {
                e.stopPropagation();
                handleImageUpload({
                    // @ts-ignore
                    file: e.target.files[0],
                    canvas: fabricRef as any,
                    shapeRef,
                    syncShapeInStorage,
                })
            }} />
            <section className="flex h-full flex-row">
                <LeftSidebar allShapes={Array.from(canvasObjects)} />
                <Live canvasRef={canvasRef} />
                <RightSideBar
                    elementAttributes={elementAttributes}
                    setElementAttributes={setElementAttributes}
                    fabricRef={fabricRef}
                    isEditingRef={isEditingRef}
                    activeObjectRef={activeObjectRef}
                    syncShapeInStorage={syncShapeInStorage}
                />
            </section>
        </main>
    );
}
