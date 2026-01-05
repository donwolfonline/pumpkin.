export default function WaveDivider({ fill = "#1E4D4D", flip = false }: { fill?: string; flip?: boolean }) {
    return (
        <div className={`relative h-24 sm:h-32 bg-transparent ${flip ? 'rotate-180' : ''}`}>
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full"
            >
                <path
                    d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
}
