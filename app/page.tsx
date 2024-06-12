'use client';

import { useEffect, useRef } from 'react';

import { fabric } from 'fabric';

import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import LeftSideBar from '@/components/LeftSideBar';
import RightSideBar from '@/components/RightSideBar';

export default function Page() {
    const canvasReef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null)
    const isDrawing = useRef<boolean>(false);

    // useEffect(() => {

    // }, [])
    return (
        <>
            <main className="h-screen overflow-hidden">
                <Navbar />
                <section className="flex h-full flex-row">
                    <LeftSideBar />
                    <Live />
                    <RightSideBar />
                </section>
            </main>
        </>
    );
}
