import { useEffect, useRef, useState } from 'react';

interface UseCameraProps {
    onStreamReady?: (stream: MediaStream) => void;
}

export function useCamera({ onStreamReady }: UseCameraProps = {}) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let mounted = true;

        async function setupCamera() {
        try {
            setIsLoading(true);
            setError(null);

            // Stop any existing stream
            if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            } 
            });

            if (!mounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
            }

            streamRef.current = stream;
            onStreamReady?.(stream);
        } catch (err) {
            if (mounted) {
            setError(err instanceof Error ? err : new Error('Failed to access camera'));
            console.error('Camera access error:', err);
            }
        } finally {
            if (mounted) {
            setIsLoading(false);
            }
        }
        }

        setupCamera();

        return () => {
        mounted = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        };
    }, [onStreamReady]);

    return {
        stream: streamRef.current,
        error,
        isLoading
    };
}