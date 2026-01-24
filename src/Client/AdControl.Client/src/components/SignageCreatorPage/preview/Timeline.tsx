import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {removeId} from "../../../utils.ts";

interface TimelineItem {
    url: string;
    durationSeconds: number;
    id: string;
}

interface TimelineProps {
    items: TimelineItem[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    onDurationChange: (index: number, duration: number) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
}

interface TimelineItemComponentProps {
    item: TimelineItem;
    index: number;
    currentIndex: number;
    widthPercent: number;
    setCurrentIndex: (index: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    onResizeStart: (
        e: React.MouseEvent,
        index: number,
        duration: number,
        side: "left" | "right"
    ) => void;
}

function TimelineItemComponent({
                                   item,
                                   index,
                                   currentIndex,
                                   widthPercent,
                                   setCurrentIndex,
                                   setIsPlaying,
                                   onResizeStart,
                               }: TimelineItemComponentProps) {
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
        width: `${widthPercent}%`,
        minWidth: "100px",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        relative flex-shrink-0 rounded-lg border-2 flex items-center justify-center
        text-xs transition-all
        ${
                currentIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
            }
        ${isDragging ? "opacity-50 z-50" : "opacity-100"}
      `}
        >
            {/* Левая ручка для растягивания */}
            <div
                className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize rounded-l-lg z-10 flex items-center justify-center"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onResizeStart(e, index, item.durationSeconds, "left");
                }}
            >
                <div className="w-0.5 h-4 bg-purple-600 opacity-0 group-hover:opacity-100"></div>
            </div>

            {/* Ручка для перетаскивания */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 transition-colors z-10"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Контент */}
            <div
                className="text-center truncate px-8 py-2 flex-1 cursor-pointer"
                onClick={() => {
                    setCurrentIndex(index);
                    setIsPlaying(false);
                }}
            >
                <div className="truncate font-medium">{removeId(item?.url || "")}</div>
                <div className="text-gray-500 mt-1">{item.durationSeconds}с</div>
            </div>

            {/* Правая ручка для растягивания */}
            <div
                className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize rounded-r-lg z-10 flex items-center justify-center"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onResizeStart(e, index, item.durationSeconds, "right");
                }}
            >
                <div className="w-0.5 h-4 bg-blue-600 opacity-0 group-hover:opacity-100"></div>
            </div>
        </div>
    );
}

export function Timeline({
                             items,
                             currentIndex,
                             setCurrentIndex,
                             setIsPlaying,
                             onDurationChange,
                             onReorder,
                         }: TimelineProps) {
    const [currentScale, setCurrentScale] = useState(1);
    const [resizing, setResizing] = useState<{
        index: number;
        startX: number;
        startDuration: number;
        side: "left" | "right";
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    const totalDuration = items.reduce((sum, i) => sum + i.durationSeconds, 0);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.altKey || e.metaKey) return;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setCurrentScale((prev) => Math.max(0.1, Math.min(10, prev * delta)));
    };

    const handleResizeStart = (
        e: React.MouseEvent,
        index: number,
        duration: number,
        side: "left" | "right"
    ) => {
        e.stopPropagation();
        setResizing({
            index,
            startX: e.clientX,
            startDuration: duration,
            side,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            onReorder(oldIndex, newIndex);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizing || !containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const pixelsPerSecond = (containerWidth * currentScale) / totalDuration;
            const deltaX = e.clientX - resizing.startX;
            const deltaSeconds = deltaX / pixelsPerSecond;

            let newDuration: number;
            if (resizing.side === "right") {
                // Делим на 10, чтобы получить правильное значение
                newDuration = Math.max(
                    0.5,
                    Math.round((resizing.startDuration + deltaSeconds) * 1) / 1
                );
            } else {
                // Делим на 10 здесь тоже
                newDuration = Math.max(
                    0.5,
                    Math.round((resizing.startDuration - deltaSeconds) * 1) / 1
                );
            }

            onDurationChange(resizing.index, newDuration);
        };

        const handleMouseUp = () => {
            setResizing(null);
        };

        if (resizing) {
            document.body.style.cursor = "col-resize";
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            document.body.style.cursor = "";
        }

        return () => {
            document.body.style.cursor = "";
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [resizing, currentScale, totalDuration, onDurationChange]);

    return (
        <Card style={{ padding: "0px", gap: "5px" }}>
            <CardHeader>
                <CardTitle className="text-base">Временная шкала контента</CardTitle>
            </CardHeader>
            <CardContent>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((item) => item.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div
                            ref={containerRef}
                            className="flex gap-2 overflow-x-auto pb-4 select-none"
                            onWheel={handleWheel}
                            style={{ scrollBehavior: "smooth" }}
                        >
                            {items.map((item, index) => {
                                const widthPercent =
                                    (item.durationSeconds / totalDuration) * 100 * currentScale;

                                return (
                                    <TimelineItemComponent
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        currentIndex={currentIndex}
                                        widthPercent={widthPercent}
                                        setCurrentIndex={setCurrentIndex}
                                        setIsPlaying={setIsPlaying}
                                        onResizeStart={handleResizeStart}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </CardContent>
        </Card>
    );
}
