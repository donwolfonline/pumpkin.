'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        const particleSize = 3;
        offscreenCanvas.width = particleSize * 2;
        offscreenCanvas.height = particleSize * 2;

        if (offscreenCtx) {
            offscreenCtx.fillStyle = 'rgba(255, 140, 26, 0.4)';
            offscreenCtx.beginPath();
            offscreenCtx.arc(particleSize, particleSize, particleSize / 2, 0, Math.PI * 2);
            offscreenCtx.fill();
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            density: number;
            opacity: number;
            fadeDirection: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.density = Math.random() * 20 + 1;
                this.opacity = Math.random();
                this.fadeDirection = Math.random() > 0.5 ? 0.005 : -0.005;
            }

            draw() {
                if (!ctx || !offscreenCanvas) return;
                ctx.globalAlpha = this.opacity;
                ctx.drawImage(offscreenCanvas, this.x - particleSize, this.y - particleSize);
            }

            update() {
                const dxMouse = mouseRef.current.x - this.x;
                const dyMouse = mouseRef.current.y - this.y;
                const distanceSq = dxMouse * dxMouse + dyMouse * dyMouse;
                const maxDistance = 200;
                const maxDistanceSq = maxDistance * maxDistance;

                if (distanceSq < maxDistanceSq) {
                    const distance = Math.sqrt(distanceSq);
                    const force = (maxDistance - distance) / maxDistance;
                    const swirlAngle = Math.atan2(dyMouse, dxMouse) + 0.1;
                    const targetX = mouseRef.current.x - Math.cos(swirlAngle) * distance;
                    const targetY = mouseRef.current.y - Math.sin(swirlAngle) * distance;

                    this.x += (targetX - this.x) * force * 0.2;
                    this.y += (targetY - this.y) * force * 0.2;
                } else {
                    if (this.x !== this.baseX) {
                        this.x -= (this.x - this.baseX) * 0.05;
                    }
                    if (this.y !== this.baseY) {
                        this.y -= (this.y - this.baseY) * 0.05;
                    }
                }

                this.opacity += this.fadeDirection;
                if (this.opacity > 0.6 || this.opacity < 0.1) {
                    this.fadeDirection *= -1;
                }
            }
        }

        const init = () => {
            particles = [];
            const spacing = 80; // Increased spacing to significantly reduce particle count
            for (let y = 0; y < canvas.height; y += spacing) {
                for (let x = 0; x < canvas.width; x += spacing) {
                    const posX = x + (Math.random() - 0.5) * 20;
                    const posY = y + (Math.random() - 0.5) * 20;
                    particles.push(new Particle(posX, posY));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ filter: 'blur(0.5px)' }}
        />
    );
}
