import { useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'

export default function UploadZone({ onUpload }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length > 0) onUpload(imageFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  return (
    <div className="p-3 shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl py-5 transition-[border-color,background,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111118] active:scale-[0.99]"
        style={{
          border: `1.5px dashed ${
            isDragOver ? '#007aff' : isHover ? '#3a3a52' : '#2a2a38'
          }`,
          background: isDragOver
            ? 'rgba(0,122,255,0.08)'
            : isHover
              ? 'rgba(255,255,255,0.02)'
              : 'transparent',
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl transition-colors duration-200"
          style={{
            width: 44,
            height: 44,
            background: isDragOver ? 'rgba(0,122,255,0.18)' : isHover ? '#22222e' : '#1a1a25',
            boxShadow: isHover && !isDragOver ? 'inset 0 0 0 1px rgba(255,255,255,0.06)' : 'none',
          }}
        >
          {isDragOver ? (
            <Upload size={20} color="#007aff" strokeWidth={2} />
          ) : (
            <ImagePlus size={20} color={isHover ? '#7a7a8e' : '#55556a'} strokeWidth={2} />
          )}
        </div>
        <div className="text-center">
          <p
            className="text-xs font-semibold transition-colors duration-200"
            style={{ color: isDragOver ? '#6eb3ff' : isHover ? '#a8a8b8' : '#88889a' }}
          >
            {isDragOver ? 'Drop to upload' : 'Upload screenshots'}
          </p>
          <p className="mt-1 text-[11px] leading-snug" style={{ color: '#5c5c70' }}>
            PNG or JPG · multiple files
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
