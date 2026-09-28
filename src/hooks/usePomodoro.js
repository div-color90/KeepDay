import { useState, useEffect, useRef, useCallback } from 'react';
const STORAGE_KEY_STATS = 'eggplan_stats';
export const usePomodoro = (onComplete) => {
    const [focusTime, setFocusTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [timeLeft, setTimeLeft] = useState(focusTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true);
    const [totalPomodoros, setTotalPomodoros] = useState(0);
    const [totalFocusTime, setTotalFocusTime] = useState(0);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY_STATS);
        if (stored) {
            const stats = JSON.parse(stored);
            setTotalPomodoros(stats.totalPomodoros || 0);
            setTotalFocusTime(stats.totalFocusTime || 0);
        }
    }, []);
    useEffect(() => {
        setTimeLeft(isFocusMode ? focusTime * 60 : breakTime * 60);
    }, [focusTime, breakTime, isFocusMode]);
    const saveStats = useCallback((pomodoros, focusTime) => {
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify({
            totalPomodoros: pomodoros,
            totalFocusTime: focusTime,
        }));
    }, []);
    const playSound = useCallback(() => {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
    }, []);
    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft((time) => {
                    if (time <= 1) {
                        playSound();
                        if (isFocusMode) {
                            const newPomodoros = totalPomodoros + 1;
                            const newFocusTime = totalFocusTime + focusTime;
                            setTotalPomodoros(newPomodoros);
                            setTotalFocusTime(newFocusTime);
                            saveStats(newPomodoros, newFocusTime);
                            onComplete?.();
                        }
                        setIsFocusMode(!isFocusMode);
                        setIsActive(false);
                        setIsPaused(false);
                        return isFocusMode ? breakTime * 60 : focusTime * 60;
                    }
                    return time - 1;
                });
            }, 1000);
        }
        else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused, isFocusMode, focusTime, breakTime, totalPomodoros, totalFocusTime, playSound, saveStats, onComplete]);
    const start = () => {
        setIsActive(true);
        setIsPaused(false);
    };
    const pause = () => {
        setIsPaused(true);
    };
    const resume = () => {
        setIsPaused(false);
    };
    const reset = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(isFocusMode ? focusTime * 60 : breakTime * 60);
    };
    const skip = () => {
        setIsFocusMode(!isFocusMode);
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(!isFocusMode ? focusTime * 60 : breakTime * 60);
    };
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    return {
        timeLeft,
        isActive,
        isPaused,
        isFocusMode,
        focusTime,
        breakTime,
        totalPomodoros,
        totalFocusTime,
        setFocusTime,
        setBreakTime,
        start,
        pause,
        resume,
        reset,
        skip,
        formatTime,
    };
};
