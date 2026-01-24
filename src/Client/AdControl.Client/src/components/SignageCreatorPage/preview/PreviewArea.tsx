import {Play, Pause, Square, Upload, Maximize2} from "lucide-react";
import type {SignageConfig} from "../types";
import { useEffect } from 'react';
import './PreviewArea.css';
import {PreviewContent} from "./PreviewContent.tsx";

interface PreviewAreaProps {
    config: SignageConfig;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    onFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}


export function PreviewArea({
                                config,
                                currentIndex,
                                setCurrentIndex,
                                isPlaying,
                                setIsPlaying,
                                onFullScreen,
                            }: PreviewAreaProps) {

    useEffect(() => {
        if (!isPlaying || config.items.length === 0) return;

        const currentItem = config.items[currentIndex];
        const duration = currentItem?.durationSeconds * 1000;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % config.items.length);
        }, duration);

        return () => clearTimeout(timer);
    }, [isPlaying, currentIndex, config.items]);

    // Остановка при смене items
    useEffect(() => {
        setIsPlaying(false);
    }, [config.items.length]);

    return (
        <div className="preview-area-card">
            <div className="preview-area-header">
                <div className="header-content">
                    <div className="header-left">
                        <button
                            className="fullscreen-button"
                            onClick={() => onFullScreen(true)}
                            disabled={config.items.length === 0}
                        >
                            <Maximize2 className="w-4 h-4" /> На весь экран
                        </button>
                    </div>
                    {config.items.length > 0 && (
                        <div className="header-right">
                            <span className="counter-text">
                                {currentIndex + 1} / {config.items.length}
                            </span>
                            <div className="controls-group">
                                <button
                                    className="control-button"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <button
                                    className="control-button"
                                    onClick={() => {
                                        setIsPlaying(false);
                                    }}
                                >
                                    <Square className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="preview-content-area">
                {config.items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Upload className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="empty-title">Контент не добавлен</h3>
                        <p className="empty-description">
                            Добавьте объекты с боковой панели для предварительного просмотра
                        </p>
                    </div>
                ) : (
                    <div className="preview-container">
                        <PreviewContent
                            item={config.items[currentIndex]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
