import type { Control } from '../types';
import ControlCard from './ControlCard';

interface Props {
  controls: Control[];
  onSelect: (id: string) => void;
  highlightIds: Set<string>;
}

export default function ControlGrid({ controls, onSelect, highlightIds }: Props) {
  if (controls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-slate-300 font-semibold mb-2">找不到符合的控制項</h3>
        <p className="text-slate-500 text-sm">請嘗試不同的關鍵字或清除篩選條件</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
      {controls.map(control => (
        <ControlCard
          key={control.id}
          control={control}
          onClick={() => onSelect(control.id)}
          highlighted={highlightIds.has(control.id)}
        />
      ))}
    </div>
  );
}
