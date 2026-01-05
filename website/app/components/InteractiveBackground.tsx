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
            size: number;
            density: number;
            angle: number;
            velocity: number;
            opacity: number;
            fadeDirection: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = Math.random() * 2 + 1;
                this.density = Math.random() * 30 + 1;
                this.angle = Math.random() * 360;
                this.velocity = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random();
                this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(255, 140, 26, ${this.opacity * 0.4})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                // Hurricane Swirl Logic
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 300;
                const force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    // Pull towards mouse but add rotational velocity
                    const swirlAngle = Math.atan2(dy, dx) + 0.1;
                    const targetX = mouseRef.current.x - Math.cos(swirlAngle) * distance;
                    const targetY = mouseRef.current.y - Math.sin(swirlAngle) * distance;

                    this.x += (targetX - this.x) * force * 0.1;
                    this.y += (targetY - this.y) * force * 0.1;
                } else {
                    // Drift back slowly
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 50;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 50;
                    }
                }

                // Opacity pulse (disappearing/showing)
                this.opacity += this.fadeDirection;
                if (this.opacity > 0.8 || this.opacity < 0.1) {
                    this.fadeDirection *= -1;
                }
            }
        }

        const init = () => {
            particles = [];
            const spacing = 40;
            for (let y = 0; y < canvas.height; y += spacing) {
                for (let x = 0; x < canvas.width; x += spacing) {
                    // Add slight randomness to grid
                    const posX = x + (Math.random() - 0.5) * 10;
                    const posY = y + (Math.random() - 0.5) * 10;
                    particles.push(new Particle(posX, posY));
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
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
