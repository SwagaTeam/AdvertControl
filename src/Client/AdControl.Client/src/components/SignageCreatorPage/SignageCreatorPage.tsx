import { useEffect, useState } from "react";

import { toast } from "../ui/toast";

import { LeftSidebar } from "./layout/LeftSidebar";
import { MainContent } from "./layout/MainContent";
import { FullscreenPreview } from "./preview/FullscreenPreview";
import {useLocation, useMatch, useParams} from "react-router-dom";

import type { SignageConfig, ContentItem } from "./types";
import { apiClient } from "../../api/apiClient.ts";


export default function SignageCreatorPage() {
    const { id: screenId } = useParams<{ id: string }>();
    const isEdit = useMatch("screen/:id/config/edit") !== null;
    const location = useLocation();

    const configId = location.state?.configId as string | undefined;
    const [config, setConfig] = useState<SignageConfig>({
        name: "",
        screensCount: 1,
        items: [],
    });

    const [loading, setLoading] = useState(false);
    const [selectedItemUrl, setSelectedItemUrl] = useState<string | null>(null);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);

    useEffect(() => {
        if (!configId) return;

        const fetchConfig = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get<SignageConfig>(`/config/${configId}`);

                setConfig({
                    id: data.id,
                    name: data.name ?? "",
                    screensCount: data.screensCount ?? 1,
                    items: data.items ?? [],
                });

            } catch (e) {
                console.error(e);
                toast.error("Ошибка загрузки конфига");
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [configId]);

    const updateItem = (url: string, updates: Partial<ContentItem>) => {
        setConfig(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.url === url ? { ...item, ...updates } : item
            ),
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Загрузка конфигурации...
            </div>
        );
    }

    return (
        <div className="flex gap-6" style={{ height: "90vh"}}>
            <LeftSidebar
                config={config}
                setConfig={setConfig}
                selectedItem={selectedItemUrl}
                setSelectedItem={setSelectedItemUrl}
                screenId={screenId}
                isEdit={isEdit}
            />

            <MainContent
                config={config}
                currentIndex={currentPreviewIndex}
                setCurrentIndex={setCurrentPreviewIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                onFullscreen={() => setShowFullscreen(true)}
                onDurationChange={(index: number, durationSeconds: number) => {
                    const itemToUpdate = config.items[index];
                    if (itemToUpdate) {
                        updateItem(itemToUpdate?.url || "", { durationSeconds });
                    }
                }}
                onReorder={(fromIndex: number, toIndex: number) => {
                    const updatedItems = [...config.items];
                    const [movedItem] = updatedItems.splice(fromIndex, 1);
                    updatedItems.splice(toIndex, 0, movedItem);

                    setConfig(prev => ({
                        ...prev,
                        items: updatedItems
                    }));

                    updateItem(movedItem?.url || "", { order: toIndex });
                }}
            />

            {showFullscreen && (
                <FullscreenPreview
                    items={config.items}
                    onClose={() => setShowFullscreen(false)}
                />
            )}
        </div>
    );
}
