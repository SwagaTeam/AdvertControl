import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { MediaItemCard } from './MediaItemCard';
import { Toolbar } from './Toolbar';
import type { SlideshowConfig, MediaItem } from './configTypes.ts';

import './config-editor-styles.css';

export function ConfigEditor() {
    const [config, setConfig] = useState<SlideshowConfig>({ items: [] });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addItem = () => {
        const newItem: MediaItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            type: 'image',
            url: '',
        };
        setConfig((prev) => ({ items: [...prev.items, newItem] }));
    };

    const updateItem = (id: string, updates: Partial<MediaItem>) => {
        setConfig((prev) => ({
            items: prev.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            ),
        }));
    };

    const deleteItem = (id: string) => {
        setConfig((prev) => ({
            items: prev.items.filter((item) => item.id !== id),
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setConfig((prev) => {
            const oldIndex = prev.items.findIndex((item) => item.id === active.id);
            const newIndex = prev.items.findIndex((item) => item.id === over.id);

            return {
                items: arrayMove(prev.items, oldIndex, newIndex),
            };
        });
    };

    return (
        <div className="editor-container">
            <h1 className="editor-title">Редактор конфига слайд-шоу</h1>

            <Toolbar config={config} onAdd={addItem} onImport={setConfig} />

            {config.items.length === 0 ? (
                <div className="empty-state">
                    <p>Слайдов пока нет. Нажмите «Добавить слайд»</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={config.items.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {config.items.map((item) => (
                            <MediaItemCard
                                key={item.id}
                                item={item}
                                onChange={updateItem}
                                onDelete={deleteItem}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            {config.items.length > 0 && (
                <div className="json-output">
                    <h3>Текущий конфиг:</h3>
                    <pre>{JSON.stringify(config, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
