export function FormattedRoast({ text }: { text: string | null }) {
    if (!text) return null;

    // Split by **bold** or *bold* markers
    // This regex captures the delimiters and the content to make reconstruction easy
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    // Treating single asterisks as bold/emphasis too, as per user preference/observation
                    return <strong key={i} className="font-bold text-white">{part.slice(1, -1)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
