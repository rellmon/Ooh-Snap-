import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import NoPhotos from '../components/camera/NoPhotos'
import PhotoSheet from '../components/camera/PhotoSheet'
import AdjustmentSliders from '../components/editor/AdjustmentSliders'
import CaptionEditor from '../components/editor/CaptionEditor'
import FilterPicker from '../components/editor/FilterPicker'
import FramePicker from '../components/editor/FramePicker'
import StickerPicker from '../components/editor/StickerPicker'
import Button from '../components/ui/Button'
import Tabs, { type TabItem } from '../components/ui/Tabs'
import { adjustmentControls } from '../data/adjustments'
import { filters } from '../data/filters'
import { frames } from '../data/frames'
import { stickerOptions } from '../data/stickers'
import { useSession } from '../hooks/useSession'
import { buildFilterCss } from '../utils/filterCss'

type EditorTab = 'filters' | 'adjust' | 'frames' | 'text' | 'stickers'

const tabs: TabItem<EditorTab>[] = [
  { id: 'filters', label: 'Filters' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'frames', label: 'Frames' },
  { id: 'text', label: 'Text' },
  { id: 'stickers', label: 'Stickers' },
]

function Editor() {
  const {
    layout,
    filter,
    selectFilter,
    adjustments,
    setAdjustment,
    resetAdjustments,
    frame,
    selectFrame,
    caption,
    updateCaption,
    stickers,
    addSticker,
    removeSticker,
    clearStickers,
    moveSticker,
    resizeSticker,
    photos,
  } = useSession()

  const [activeTab, setActiveTab] = useState<EditorTab>('filters')
  // Which sticker is selected is a screen detail, so it lives here, not in the session.
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  // Worked out from the list each time, so a removed sticker is deselected automatically.
  const selectedSticker =
    stickers.find((sticker) => sticker.uid === selectedUid) ?? null

  if (photos.length === 0) {
    return <NoPhotos />
  }

  const filterCss = buildFilterCss(filter, adjustments)

  return (
    <div className="mx-auto max-w-5xl px-6 pb-16">
      <h1 className="pt-6 text-center text-4xl font-bold text-brand-600">
        Make it yours
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        <div className="min-w-0 md:sticky md:top-4">
          <PhotoSheet
            layout={layout}
            photos={photos}
            filterCss={filterCss}
            frame={frame}
            caption={caption}
            onMoveCaption={(x, y) => updateCaption({ x, y })}
            stickers={stickers}
            selectedUid={selectedSticker?.uid ?? null}
            onSelectSticker={setSelectedUid}
            onMoveSticker={moveSticker}
          />
          {(stickers.length > 0 || caption.content.trim() !== '') && (
            <p className="mt-3 text-center text-sm text-slate-600">
              Drag stickers and text to move them. On a keyboard, focus one and
              use the arrow keys (hold Shift for bigger steps).
            </p>
          )}
        </div>

        <div className="min-w-0">
          <Tabs
            tabs={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
            label="Editing tools"
          >
            {activeTab === 'filters' && (
              <FilterPicker
                filters={filters}
                selectedId={filter.id}
                onSelect={selectFilter}
              />
            )}

            {activeTab === 'adjust' && (
              <AdjustmentSliders
                controls={adjustmentControls}
                values={adjustments}
                onChange={setAdjustment}
                onReset={resetAdjustments}
              />
            )}

            {activeTab === 'frames' && (
              <FramePicker
                frames={frames}
                selectedId={frame.id}
                onSelect={selectFrame}
              />
            )}

            {activeTab === 'text' && (
              <CaptionEditor caption={caption} onChange={updateCaption} />
            )}

            {activeTab === 'stickers' && (
              <StickerPicker
                options={stickerOptions}
                placed={stickers}
                selected={selectedSticker}
                onAdd={(emoji) => setSelectedUid(addSticker(emoji))}
                onSelect={setSelectedUid}
                onResize={resizeSticker}
                onRemove={removeSticker}
                onClear={clearStickers}
              />
            )}
          </Tabs>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button to="/review" variant="secondary" size="lg">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to photos
        </Button>
        <Button to="/final" size="lg">
          Finish
          <ArrowRight size={20} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export default Editor