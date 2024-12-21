import { useEffect, useRef, useState } from 'react';

interface VideoStreamOptions {
    width?: number;
    height?: number;
    facingMode?: 'user' | 'environment';
}

export function useVideoStream(options: VideoStreamOptions = {}) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const streamRef = useRef<MediaStream | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        async function initializeStream() {
        try {
            setIsLoading(true);
            setError(null);

            // Ensure previous stream is properly cleaned up
            if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                streamRef.current?.removeTrack(track);
            });
            streamRef.current = null;
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: options.width || 640 },
                height: { ideal: options.height || 480 },
                facingMode: options.facingMode || 'user'
            }
            });

            if (!mountedRef.current) {
            newStream.getTracks().forEach(track => track.stop());
            return;
            }

            streamRef.current = newStream;
            setStream(newStream);
        } catch (err) {
            if (mountedRef.current) {
            const error = err instanceof Error ? err : new Error('Failed to access camera');
            setError(error);
            console.error('Camera access error:', error);
            }
        } finally {
            if (mountedRef.current) {
            setIsLoading(false);
            }
        }
        }

        initializeStream();

        return () => {
        mountedRef.current = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
            track.stop();
            streamRef.current?.removeTrack(track);
            });
            streamRef.current = null;
        }
        };
    }, [options.width, options.height, options.facingMode]);

    return { stream, error, isLoading };
}