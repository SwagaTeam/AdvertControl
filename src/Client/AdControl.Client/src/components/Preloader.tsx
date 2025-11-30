import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
    return (
        <div className="preloader-container">
            <div className="preloader">
                {/* Градиентный орб, который пульсирует */}
                <div className="orb"></div>

                {/* Волны света */}
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>

                {/* Плавающие частицы */}
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
                <div className="particle particle-4"></div>
                <div className="particle particle-5"></div>

                {/* Текст с анимацией появления */}
                <div className="loading-text">
                    <span>З</span>
                    <span>а</span>
                    <span>г</span>
                    <span>р</span>
                    <span>у</span>
                    <span>з</span>
                    <span>к</span>
                    <span>а</span>
                    <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
                </div>
            </div>
        </div>
    );
};

// Полноэкранный прелоадер (можно использовать как отдельную страницу)
export const PreloaderPage: React.FC = () => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%)',
            margin: 0,
            padding: 0,
        }}>
            <Preloader />
        </div>
    );
};

