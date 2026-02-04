import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';


export interface CanvasPadRef {
    clear: () => void;
    save: () => void;
}

interface CanvasPadProps {
    onSave?: (blob: Blob | null, base64: string) => void;
    className?: string;
    backgroundImage?: string;
}

export const CanvasPad = forwardRef<CanvasPadRef, CanvasPadProps>(({ onSave, className = '', backgroundImage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // Set internal resolution to match display size for sharpness
            // (Assuming full width/height based on container)
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3;
                setContext(ctx);
            }
        }
    }, [backgroundImage]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            if (context && canvasRef.current) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        },
        save: () => {
            if (canvasRef.current && onSave) {
                canvasRef.current.toBlob((blob) => {
                    const base64 = canvasRef.current!.toDataURL('image/png');
                    onSave(blob, base64);
                });
            }
        }
    }));

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!context) return;
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        context.beginPath();
        context.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !context) return;
        const { x, y } = getCoordinates(e);
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        if (context) context.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="relative border-2 border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden touch-none" style={{ height: '400px' }}>
                {backgroundImage && (
                    <img
                        src={backgroundImage}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    />
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            {/* External controls only */}
        </div>
    );
});

CanvasPad.displayName = "CanvasPad";
