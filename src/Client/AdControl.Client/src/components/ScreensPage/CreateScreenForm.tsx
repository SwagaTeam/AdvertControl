import { useState, useEffect } from "react";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog.tsx";
import { joinResolutionData } from "../../utils.ts";

interface CreateScreenFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (screenData: {
        code: string;
        name: string;
        resolution: string;
        location: string;
    }) => void;
    isSubmitting?: boolean;
    error?: string | null;
    initialCode?: string;
}

export function CreateScreenForm({
                                     isOpen,
                                     onOpenChange,
                                     onSubmit,
                                     isSubmitting = false,
                                     error = null,
                                     initialCode,
                                 }: CreateScreenFormProps) {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        resolutionWidth: "",
        resolutionHeight: "",
        location: "",
    });

    const [formErrors, setFormErrors] = useState({
        code: "",
        name: "",
        resolutionWidth: "",
        resolutionHeight: "",
        location: "",
    });

    // Сброс формы при открытии + подстановка initialCode
    useEffect(() => {
        if (isOpen) {
            setFormData({
                code: initialCode || "",
                name: "",
                resolutionWidth: "",
                resolutionHeight: "",
                location: "",
            });

            setFormErrors({
                code: "",
                name: "",
                resolutionWidth: "",
                resolutionHeight: "",
                location: "",
            });
        }
    }, [isOpen, initialCode]);

    const validateForm = () => {
        const errors = {
            code: "",
            name: "",
            resolutionWidth: "",
            resolutionHeight: "",
            location: "",
        };

        if (!formData.code.trim()) errors.code = "Код привязки обязателен";
        if (!formData.name.trim()) errors.name = "Название обязательно";
        if (!formData.resolutionWidth.trim()) errors.resolutionWidth = "Ширина обязательна";
        if (!formData.resolutionHeight.trim()) errors.resolutionHeight = "Высота обязательна";
        if (!formData.location.trim()) errors.location = "Расположение обязательно";

        setFormErrors(errors);

        return Object.values(errors).every((err) => !err);
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const resolution = joinResolutionData(
            formData.resolutionWidth,
            formData.resolutionHeight
        );

        onSubmit({
            code: formData.code.trim(),
            name: formData.name.trim(),
            resolution,
            location: formData.location.trim(),
        });
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Добавить новый экран</DialogTitle>
                    <DialogDescription>
                        Создайте новый рекламный экран в своей сети
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Код привязки */}
                    <div className="space-y-2">
                        <Label htmlFor="code">Код привязки *</Label>
                        <Input
                            id="code"
                            placeholder="Например: 834149"
                            value={formData.code}
                            onChange={(e) => handleChange("code", e.target.value)}
                            className={formErrors.code ? "border-red-500" : ""}
                            disabled={isSubmitting}
                        />
                        {formErrors.code && (
                            <p className="text-sm text-red-600">{formErrors.code}</p>
                        )}
                    </div>

                    {/* Название */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Название *</Label>
                        <Input
                            id="name"
                            placeholder="Экран в ТЦ Европа"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={formErrors.name ? "border-red-500" : ""}
                            disabled={isSubmitting}
                        />
                        {formErrors.name && (
                            <p className="text-sm text-red-600">{formErrors.name}</p>
                        )}
                    </div>

                    {/* Разрешение */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Ширина *</Label>
                            <Input
                                id="width"
                                type="number"
                                placeholder="1920"
                                value={formData.resolutionWidth}
                                onChange={(e) => handleChange("resolutionWidth", e.target.value)}
                                className={formErrors.resolutionWidth ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {formErrors.resolutionWidth && (
                                <p className="text-sm text-red-600">{formErrors.resolutionWidth}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Высота *</Label>
                            <Input
                                id="height"
                                type="number"
                                placeholder="1080"
                                value={formData.resolutionHeight}
                                onChange={(e) => handleChange("resolutionHeight", e.target.value)}
                                className={formErrors.resolutionHeight ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {formErrors.resolutionHeight && (
                                <p className="text-sm text-red-600">{formErrors.resolutionHeight}</p>
                            )}
                        </div>
                    </div>

                    {/* Расположение */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Расположение *</Label>
                        <Input
                            id="location"
                            placeholder="ТЦ «Европа», 1 этаж, фуд-корт"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className={formErrors.location ? "border-red-500" : ""}
                            disabled={isSubmitting}
                        />
                        {formErrors.location && (
                            <p className="text-sm text-red-600">{formErrors.location}</p>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Отменить
                    </Button>
                    <Button
                        style={{ backgroundColor: "#2563EB" }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Создание..." : "Добавить экран"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
