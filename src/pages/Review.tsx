import { Camera, RotateCcw } from 'lucide-react'
import ComposedPreview from '../components/camera/ComposedPreview'
import PhotoSheet from '../components/camera/PhotoSheet'
import AdjustmentSliders from '../components/editor/AdjustmentSliders'
import FilterPicker from '../components/editor/FilterPicker'
import FramePicker from '../components/editor/FramePicker'
import StickerPicker from '../components/editor/StickerPicker'
import Button from '../components/ui/Button'
import { adjustmentControls } from '../data/adjustments'
import { filters } from '../data/filters'
import { frames } from '../data/frames'
import { stickerOptions } from '../data/stickers'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useSession } from '../hooks/useSession'
import { buildFilterCss } from '../utils/filterCss'

function Review() {
  const {
    layout,
    filter,
    selectFilter,
    adjustments,
    setAdjustment,
    resetAdjustments,
    frame,
    selectFrame,
    stickers,
    addSticker,
    removeSticker,
    clearStickers,
    moveSticker,
    photos,
    clearPhotos,
  } = useSession()

  // The cheap CSS preview uses these right away...
  const filterCss = buildFilterCss(filter, adjustments)
  // ...while the heavy canvas redraw waits until dragging or sliding stops.
  const finalFilterCss = useDebouncedValue(filterCss, 250)
  const finalStickers = useDebouncedValue(stickers, 250)

  if (photos.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <Camera size={48} className="text-brand-300" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold">No photos yet</h1>
        <p className="mt-2 text-slate-600">
          Head to the booth and strike a pose first.
        </p>
        <Button to="/booth" className="mt-8">
          Go to the booth
        </Button>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <h1 className="pt-6 text-center text-4xl font-bold text-brand-600">
        How did we do?
      </h1>
      <p className="mt-2 text-center text-slate-600">
        Your {layout.name}. Not happy with a shot? Go back and retake it.
      </p>

      <div className="mt-6">
        <FilterPicker
          filters={filters}
          selectedId={filter.id}
          onSelect={selectFilter}
        />
      </div>

      <div className="mt-6">
        <AdjustmentSliders
          controls={adjustmentControls}
          values={adjustments}
          onChange={setAdjustment}
          onReset={resetAdjustments}
        />
      </div>

      <div className="mt-6">
        <FramePicker
          frames={frames}
          selectedId={frame.id}
          onSelect={selectFrame}
        />
      </div>

      <div className="mt-6">
        <StickerPicker
          options={stickerOptions}
          placed={stickers}
          onAdd={addSticker}
          onRemove={removeSticker}
          onClear={clearStickers}
        />
      </div>

      <div className="mt-8">
        <PhotoSheet
          layout={layout}
          photos={photos}
          filterCss={filterCss}
          frame={frame}
          stickers={stickers}
          onMoveSticker={moveSticker}
        />
        {stickers.length > 0 && (
          <p className="mt-3 text-center text-sm text-slate-600">
            Drag a sticker to move it. On a keyboard, focus one and use the
            arrow keys (hold Shift for bigger steps).
          </p>
        )}
      </div>

      <section aria-labelledby="final-image" className="mt-12">
        <h2 id="final-image" className="text-center text-2xl font-bold">
          Final image
        </h2>
        <p className="mb-4 mt-1 text-center text-sm text-slate-600">
          Drawn with the Canvas API. This is what you'll download.
        </p>
        <ComposedPreview
          layout={layout}
          photos={photos}
          filterCss={finalFilterCss}
          frame={frame}
          stickers={finalStickers}
        />
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/booth" size="lg">
          <Camera size={20} aria-hidden="true" />
          Back to the booth
        </Button>
        <Button variant="secondary" size="lg" onClick={clearPhotos}>
          <RotateCcw size={18} aria-hidden="true" />
          Start over
        </Button>
      </div>
    </div>
  )
}

export default Review