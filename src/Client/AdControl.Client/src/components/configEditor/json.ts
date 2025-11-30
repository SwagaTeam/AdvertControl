import type { SlideshowConfig } from './configTypes.ts';

export const exportConfig = (config: SlideshowConfig) => {
    const data = JSON.stringify(config, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slideshow-config.json';
    a.click();
    URL.revokeObjectURL(url);
};

export const readImportedFile = (
    file: File
): Promise<SlideshowConfig> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (json && Array.isArray(json.items)) {
                    resolve(json as SlideshowConfig);
                } else {
                    reject(new Error('Неверный формат конфига'));
                }
            } catch (err) {
                reject(err);
            }
        });
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsText(file);
    });
};
