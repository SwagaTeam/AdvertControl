import { Image as ImageIcon,  Video } from "lucide-react";
import type { ContentItem } from "../types";
import {MINIO_PUBLIC_URL} from "../../../api/apiClient.ts";
import {buildMinioUrl} from "../../../utils.ts";
import "./PreviewArea.css"

interface PreviewContentProps {
    item: ContentItem;
}

export function PreviewContent({ item }: PreviewContentProps) {
    const fullImageUrl = buildMinioUrl(MINIO_PUBLIC_URL, item.url);

    return (
        <div className="preview-content-wrapper">
            {(item.type === "IMAGE") && (
                <>
                    {fullImageUrl ? (
                        <div className="image-container">
                            <img
                                src={fullImageUrl}
                                alt={item.url}
                                className="preview-image"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (placeholder) placeholder.classList.remove("hidden");
                                }}
                            />
                        </div>
                    ) : null}

                    {(!fullImageUrl) && (
                        <div className="placeholder-content">
                            <ImageIcon className="w-32 h-32 opacity-50" />
                            <span className="placeholder-text">Изображение не загружено</span>
                        </div>
                    )}
                </>
            )}

            {(item.type === "VIDEO") && (
                <>
                    {item.url ? (
                        <div className="video-container">
                            <video
                                src={`${MINIO_PUBLIC_URL}/${encodeURIComponent(item.url)}`}
                                autoPlay
                                playsInline
                                className="preview-video"
                            />
                        </div>
                    ) : (
                        <div className="video-placeholder">
                            <Video className="w-32 h-32 text-white/50" />
                            <span className="video-placeholder-text">Видео не загружено</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
