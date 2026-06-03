import { StudentType } from '../types'

export type FilterOption = 'all' | StudentType

const options: { value: FilterOption; label: string }[] = [
  { value: 'all', label: '全部留言' },
  { value: 'primary', label: '🌸 小学生留言' },
  { value: 'college', label: '🎓 大学生留言' },
]

export function FilterTabs({ value, onChange }: { value: FilterOption; onChange: (v: FilterOption) => void }) {
  return (
    <div className="filter-tabs">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`filter-tab ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
