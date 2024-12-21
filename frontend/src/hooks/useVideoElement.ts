import { useEffect, useRef } from 'react';

export function useVideoElement(stream: MediaStream | null) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playAttemptRef = useRef<number>(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !stream) return;

        let mounted = true;
        video.srcObject = stream;
        
        const playVideo = async () => {
        if (!mounted || !video.srcObject) return;
        
        try {
            video.muted = true;
            await video.play();
            playAttemptRef.current = 0; // Reset counter on successful play
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError' && playAttemptRef.current < 3) {
            // Retry play up to 3 times with increasing delay
            playAttemptRef.current += 1;
            setTimeout(playVideo, playAttemptRef.current * 500);
            } else {
            console.error('Error playing video:', err);
            }
        }
        };

        // Small delay before first play attempt to ensure proper setup
        setTimeout(playVideo, 100);

        return () => {
        mounted = false;
        if (video.srcObject) {
            video.pause();
            video.srcObject = null;
        }
        };
    }, [stream]);

    return videoRef;
}