'use client';

import { useEffect, useRef, useState } from 'react';

import { fabric } from 'fabric';

import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import LeftSideBar from '@/components/LeftSideBar';
import RightSideBar from '@/components/RightSideBar';
import { handleCanvasMouseDown, handleResize, initializeFabric } from '@/lib/canvas';
import { ActiveElement } from '@/types/type';

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null)
    const isDrawing = useRef<boolean>(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>('rectangle')


    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: ""
    })

    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem);
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
        window.addEventListener('resize', () => {
            handleResize({
                canvas: fabricRef.current
            })
        })
    }, [])
    return (
        <>
            <main className="h-screen overflow-hidden">
                <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement}  />
                <section className="flex h-full flex-row">
                    <LeftSideBar />
                    <Live canvasRef={canvasRef} />
                    <RightSideBar />
                </section>
            </main>
        </>
    );
}
