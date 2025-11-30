export type MediaItem = {
    id: string;
    type: 'image' | 'video';
    url: string;
    inlineData?: string;
    checksum?: string;
    size?: number;
};

export type SlideshowConfig = {
    items: MediaItem[];
};
