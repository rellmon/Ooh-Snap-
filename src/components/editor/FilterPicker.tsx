import type { FilterId, PhotoFilter } from '../../types/filter'
import TileButton from '../ui/TileButton'

type FilterPickerProps = {
  filters: PhotoFilter[]
  selectedId: FilterId
  onSelect: (id: FilterId) => void
  // A photo to show every filter on, so the effect is visible before choosing.
  previewSrc?: string
}

function FilterPicker({
  filters,
  selectedId,
  onSelect,
  previewSrc,
}: FilterPickerProps) {
  return (
    <div
      role="group"
      aria-label="Photo filters"
      className="grid grid-cols-4 gap-3"
    >
      {filters.map((filter) => (
        <TileButton
          key={filter.id}
          label={filter.name}
          selected={filter.id === selectedId}
          onClick={() => onSelect(filter.id)}
        >
          {previewSrc && (
            <img
              src={previewSrc}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
              style={{ filter: filter.css }}
            />
          )}
        </TileButton>
      ))}
    </div>
  )
}

export default FilterPicker