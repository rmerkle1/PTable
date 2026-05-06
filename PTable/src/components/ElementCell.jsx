export default function ElementCell({ element, color, isSelected, onSelect, size = 'md' }) {
  const sizes = {
    sm: { cell: 'w-9 h-9', num: 'text-[7px]', sym: 'text-sm leading-none', name: 'hidden' },
    md: { cell: 'w-12 h-12', num: 'text-[8px]', sym: 'text-base leading-none', name: 'text-[6px] leading-none truncate' },
    lg: { cell: 'w-14 h-14', num: 'text-[9px]', sym: 'text-lg leading-none', name: 'text-[7px] leading-none truncate' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <button
      className={`
        ${s.cell} flex flex-col items-center justify-center rounded
        border transition-all duration-150 cursor-pointer select-none
        ${isSelected
          ? 'border-white scale-110 z-10 shadow-lg shadow-black/50'
          : 'border-transparent hover:border-white/50 hover:scale-105 hover:z-10'}
      `}
      style={{ backgroundColor: color, opacity: color === '#2a2a3a' ? 0.5 : 1 }}
      onClick={() => onSelect(element)}
      title={element.name}
    >
      <span className={`${s.num} text-white/70 font-mono`}>{element.number}</span>
      <span className={`${s.sym} text-white font-bold`}>{element.symbol}</span>
      {s.name !== 'hidden' && (
        <span className={`${s.name} text-white/60 w-full text-center px-0.5`}>{element.name}</span>
      )}
    </button>
  );
}
