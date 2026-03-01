export interface SpecCardProps {
  /** Material Symbols icon name (e.g. "speed", "engineering") */
  icon: string;
  /** Display label for the spec */
  label: string;
  /** Formatted value (string or number with unit) */
  value: string | number;
}

export default function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div
      className="flex flex-col min-h-[88px] p-4 rounded-xl border border-slate-200 bg-white shadow-sm"
      data-spec-card
    >
      <span
        className="material-symbols-outlined text-slate-500 text-2xl mb-2"
        aria-hidden
      >
        {icon}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="text-sm font-bold text-slate-800 mt-0.5 truncate">
        {value}
      </span>
    </div>
  );
}
