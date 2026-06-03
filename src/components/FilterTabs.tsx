import { StudentType } from '../types'

export type FilterOption = 'all' | StudentType | 'newest' | 'hottest' | 'unanswered'

interface Option { value: FilterOption; label: string; group: 'filter' | 'sort' | 'special' }

const options: Option[] = [
  { value: 'all', label: '全部留言', group: 'filter' },
  { value: 'primary', label: '🌸 小学生', group: 'filter' },
  { value: 'college', label: '🎓 大学生', group: 'filter' },
  { value: 'newest', label: '🕐 最新', group: 'sort' },
  { value: 'hottest', label: '🔥 最热', group: 'sort' },
  { value: 'unanswered', label: '✉ 未回复', group: 'special' },
]

export function FilterTabs({ value, onChange }: { value: FilterOption; onChange: (v: FilterOption) => void }) {
  return (
    <div className="filter-tabs">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`filter-tab ${value === opt.value ? 'active' : ''} filter-tab-${opt.group}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
