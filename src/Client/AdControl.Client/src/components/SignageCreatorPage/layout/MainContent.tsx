import { PreviewArea } from "../preview/PreviewArea";
import { Timeline } from "../preview/Timeline";
import type { SignageConfig } from "../types";
import {useEffect} from "react";

interface Props {
    config: SignageConfig;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    onFullscreen: () => void;
    onDurationChange: (index: number, duration: number) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
}
export function MainContent({
                                config,
                                currentIndex,
                                setCurrentIndex,
                                isPlaying,
                                setIsPlaying,
                                onFullscreen,
                                onDurationChange,
                                onReorder
                            }: Props) {

    useEffect(() => {
        if (config.items.length > 0 && currentIndex >= config.items.length) {
            setCurrentIndex(0);
        }
    }, [config.items.length, currentIndex, setCurrentIndex]);

    return (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <PreviewArea
                config={config}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                onFullScreen={onFullscreen}
            />

            {config.items.length > 0 && (
                <Timeline
                    items={config.items}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    setIsPlaying={setIsPlaying}
                    onDurationChange={onDurationChange}
                    onReorder={onReorder}
                />
            )}
        </div>
    );
}
