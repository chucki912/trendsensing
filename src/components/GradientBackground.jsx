import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function GradientBackground({ isDark }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let t = 0;

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);

            if (isDark) {
                // Deep Space Aurora
                gradient.addColorStop(0, '#0f172a'); // Slate 900
                gradient.addColorStop(0.5, '#1e1b4b'); // Indigo 950
                gradient.addColorStop(1, '#020617'); // Slate 950
            } else {
                // Soft Day Aurora
                gradient.addColorStop(0, '#f0f9ff'); // Sky 50
                gradient.addColorStop(0.5, '#eef2ff'); // Indigo 50
                gradient.addColorStop(1, '#fdf4ff'); // Fuchsia 50
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Orbs
            const particles = isDark ? [
                { x: Math.sin(t * 0.001) * width * 0.3 + width * 0.2, y: Math.cos(t * 0.001) * height * 0.2 + height * 0.3, r: 400, color: 'rgba(56, 189, 248, 0.15)' }, // Sky
                { x: Math.cos(t * 0.0015) * width * 0.3 + width * 0.8, y: Math.sin(t * 0.002) * height * 0.2 + height * 0.6, r: 500, color: 'rgba(168, 85, 247, 0.15)' }, // Purple
                { x: Math.sin(t * 0.002) * width * 0.3 + width * 0.5, y: Math.cos(t * 0.001) * height * 0.2 + height * 0.8, r: 350, color: 'rgba(236, 72, 153, 0.1)' }, // Pink
            ] : [
                { x: Math.sin(t * 0.001) * width * 0.3 + width * 0.2, y: Math.cos(t * 0.001) * height * 0.2 + height * 0.3, r: 500, color: 'rgba(14, 165, 233, 0.08)' }, // Sky
                { x: Math.cos(t * 0.0015) * width * 0.3 + width * 0.8, y: Math.sin(t * 0.002) * height * 0.2 + height * 0.6, r: 600, color: 'rgba(139, 92, 246, 0.08)' }, // Violet
                { x: Math.sin(t * 0.002) * width * 0.3 + width * 0.5, y: Math.cos(t * 0.001) * height * 0.2 + height * 0.8, r: 400, color: 'rgba(244, 63, 94, 0.08)' }, // Rose
            ];

            particles.forEach(p => {
                ctx.beginPath();
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, p.color);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            t += 1;
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none transition-colors duration-1000"
            style={{ zIndex: -1 }}
        />
    );
}

GradientBackground.propTypes = {
    isDark: PropTypes.bool
};
