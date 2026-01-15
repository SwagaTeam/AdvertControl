import { useState } from "react";
import ContentLoader from "react-content-loader";
import { Sparkles } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "./ui/sonner.tsx";
import { apiClient, MINIO_PUBLIC_URL } from "../api/apiClient.ts";

const ImageLoader = () => (
    <ContentLoader
        speed={2}
        width={400}
        height={300}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <rect x="0" y="0" rx="12" ry="12" width="400" height="300" />
    </ContentLoader>
);

export function ImageGenerationPage() {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const generateFromText = async () => {
        if (!prompt.trim()) {
            toast.error("Введите описание");
            return;
        }

        try {
            setLoading(true);
            setGenerating(true);
            setImageUrl(null);

            const response = await apiClient.post("image/generate/", {
                prompt: prompt,
            });

            if (response.data.filename) {
                const fullImageUrl = `${MINIO_PUBLIC_URL}/${response.data.filename}`;
                setImageUrl(fullImageUrl);
            } else {
                throw new Error("Не получено имя файла в ответе");
            }
        } catch (error: any) {
            console.error("Ошибка генерации:", error);
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Ошибка генерации изображения"
            );
        } finally {
            setLoading(false);
            setTimeout(() => setGenerating(false), 300);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1>Генерация изображений</h1>
                <p className="text-gray-600 mt-1">
                    ИИ-генерация по текстовому описанию
                </p>
            </div>

            <Card className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                        rows={10}
                        placeholder="Футуристичный город в стиле киберпанк"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{ minHeight: "100px" }}
                    />
                </div>

                <Button
                    onClick={generateFromText}
                    disabled={loading}
                    className="gap-2 relative overflow-hidden"
                    style={{ backgroundColor: "#2563EB" }}
                >
                    {generating && (
                        <div className="absolute inset-0 bg-blue-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            </div>
                        </div>
                    )}

                    <Sparkles className={`h-4 w-4 ${generating ? 'invisible' : ''}`} />
                    <span className={generating ? 'invisible' : ''}>
            {loading ? 'Генерация...' : 'Сгенерировать'}
          </span>
                </Button>
            </Card>

            <Card className="p-6 flex justify-center min-h-[320px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <ImageLoader />
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-ping rounded-full bg-blue-600"></div>
                            <div className="h-2 w-2 animate-ping rounded-full bg-blue-600" style={{ animationDelay: "0.1s" }}></div>
                            <div className="h-2 w-2 animate-ping rounded-full bg-blue-600" style={{ animationDelay: "0.2s" }}></div>
                            <span className="text-gray-600">Генерируем изображение...</span>
                        </div>
                    </div>
                ) : imageUrl ? (
                    <div className="space-y-4">
                        <img
                            src={imageUrl}
                            alt="Generated"
                            className="rounded-xl max-w-full max-h-[500px] object-contain"
                            onError={() => {
                                toast.error("Не удалось загрузить изображение");
                                setImageUrl(null);
                            }}
                        />
                        <div className="text-center">
                            <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Открыть в новой вкладке
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">
              Результат появится здесь
            </span>
                    </div>
                )}
            </Card>
        </div>
    );
}
