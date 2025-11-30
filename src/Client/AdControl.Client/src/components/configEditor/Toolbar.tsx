import React from 'react';
import { exportConfig, readImportedFile } from './json';
import type { SlideshowConfig } from './configTypes.ts';

const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const UploadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const DownloadIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

interface Props {
    config: SlideshowConfig;
    onAdd: () => void;
    onImport: (config: SlideshowConfig) => void;
}

export const Toolbar: React.FC<Props> = ({ config, onAdd, onImport }) => {
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const imported = await readImportedFile(file);
            onImport(imported);
        } catch (err) {
            alert((err as Error).message || 'Ошибка импорта');
        }
    };

    return (
        <div className="toolbar">
            <button onClick={onAdd} className="btn btn-primary">
                <PlusIcon /> Добавить слайд
            </button>

            <label className="btn btn-secondary">
                <UploadIcon /> Импорт JSON
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>

            <button onClick={() => exportConfig(config)} className="btn btn-secondary">
                <DownloadIcon /> Экспорт JSON
            </button>
        </div>
    );
};
