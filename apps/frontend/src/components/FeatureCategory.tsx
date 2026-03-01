export interface FeatureCategoryProps {
  /** Material Symbols icon name */
  icon: string;
  /** Category heading */
  title: string;
  /** List of feature items */
  items: string[];
}

export default function FeatureCategory({ icon, title, items }: FeatureCategoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h4 className="font-bold font-display uppercase tracking-tight text-slate-800 mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl" aria-hidden>
          {icon}
        </span>
        {title}
      </h4>
      <ul className="space-y-2" role="list">
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="text-sm text-slate-600 flex items-start gap-2 leading-tight"
          >
            <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5" aria-hidden>
              check
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
