import { useCallback, useEffect, useRef, useState } from "react";

export function usePositionObserver(target: Element | null, active: boolean): DOMRect | undefined {
    const [position, setPosition] = useState<DOMRect>();

    const onAnimationFrameHandler = useCallback(() => {
        const newPosition: DOMRect | undefined = target?.getBoundingClientRect();

        if (shouldUpdatePosition(newPosition, position)) {
            setPosition(newPosition);
        }
    }, [position, target]);

    useAnimationFrameEffect(active ? onAnimationFrameHandler : undefined);

    return position;
}

function useAnimationFrameEffect(callback?: () => void): void {
    const requestId = useRef<number | undefined>();

    const onAnimationFrame = useCallback(() => {
        callback!();
        requestId.current = window.requestAnimationFrame(onAnimationFrame);
    }, [callback]);

    useEffect(() => {
        if (!callback) {
            return;
        }

        requestId.current = window.requestAnimationFrame(onAnimationFrame);
        return () => {
            window.cancelAnimationFrame(requestId.current!);
        };
    }, [callback, onAnimationFrame]);
}

function shouldUpdatePosition(a?: DOMRect, b?: DOMRect): boolean {
    return (
        !a ||
        !b ||
        a.height !== b.height ||
        a.width !== b.width ||
        a.bottom !== b.bottom ||
        a.top !== b.top ||
        a.left !== b.left ||
        a.right !== b.right
    );
}
