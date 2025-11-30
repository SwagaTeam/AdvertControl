import React from 'react';
import type { MediaItem } from './configTypes.ts';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    item: MediaItem;
    onChange: (id: string, updates: Partial<MediaItem>) => void;
    onDelete: (id: string) => void;
}

const GripIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="9" cy="6" r="1"></circle>
        <circle cx="15" cy="6" r="1"></circle>
        <circle cx="9" cy="18" r="1"></circle>
        <circle cx="15" cy="18" r="1"></circle>
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const UploadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

export const MediaItemCard: React.FC<Props> = ({ item, onChange, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            const dataUrl = ev.target?.result as string;
            onChange(item.id, {
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url: URL.createObjectURL(file),
                inlineData: dataUrl,
                size: file.size,
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`slide-item ${isDragging ? 'dragging' : ''}`}
        >
            <div className="drag-handle" {...attributes} {...listeners}>
                <GripIcon />
            </div>

            <div className="slide-content">
                <div className="slide-header">
                    <select
                        value={item.type}
                        onChange={e => onChange(item.id, { type: e.target.value as 'image' | 'video' })}
                    >
                        <option value="image">Изображение</option>
                        <option value="video">Видео</option>
                    </select>
                    <button className="btn-delete" onClick={() => onDelete(item.id)}>
                        <TrashIcon />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="URL изображения или видео"
                    value={item.url || ''}
                    onChange={e => onChange(item.id, { url: e.target.value })}
                    className="url-input"
                />

                <label className="file-label">
                    <input type="file" accept="image/*,video/*" onChange={handleFile} />
                    <UploadIcon /> Загрузить файл
                </label>

                {(item.url || item.inlineData) && (
                    <div className="preview">
                        {item.type === 'image' ? (
                            <img src={item.url || item.inlineData} alt="preview" />
                        ) : (
                            <video src={item.url || item.inlineData} controls />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
