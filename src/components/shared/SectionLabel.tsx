interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-xs tracking-[0.5em] uppercase text-white/60">
        {text}
      </span>
      <div className="flex-1 h-px bg-[#c9b99a]/30" />
    </div>
  );
}
