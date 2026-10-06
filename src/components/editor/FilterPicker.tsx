import Button from '../ui/Button'
import type { FilterId, PhotoFilter } from '../../types/filter'

type FilterPickerProps = {
  filters: PhotoFilter[]
  selectedId: FilterId
  onSelect: (id: FilterId) => void
}

function FilterPicker({ filters, selectedId, onSelect }: FilterPickerProps) {
  return (
    <div
      role="group"
      aria-label="Photo filters"
      className="flex flex-wrap justify-center gap-3"
    >
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={filter.id === selectedId ? 'primary' : 'secondary'}
          aria-pressed={filter.id === selectedId}
          onClick={() => onSelect(filter.id)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  )
}

export default FilterPicker