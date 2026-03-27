interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlight?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight = false }: FeatureCardProps) => {
    return (
        <div
            className={`relative rounded-xl border transition-colors ${highlight
                ? "bg-[#0c0c10] border-white/10 p-7 shadow-sm"
                : "bg-black/20 border-white/[0.04] p-6 hover:border-white/10"
                }`}
        >
            {/* Icon */}
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${highlight
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-white/40"
                    }`}
            >
                {icon}
            </div>

            {/* Content */}
            <h3 className={`font-medium mb-1.5 ${highlight ? "text-white text-base" : "text-white/80 text-sm"}`}>{title}</h3>
            <p className={`leading-relaxed ${highlight ? "text-white/50 text-sm" : "text-white/30 text-xs"}`}>{description}</p>
        </div>
    );
};

export default FeatureCard;
