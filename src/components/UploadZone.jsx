import { useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'

export default function UploadZone({ onUpload }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

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
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="w-full flex flex-col items-center justify-center gap-2 rounded-xl py-5 transition-all cursor-pointer"
        style={{
          border: `1.5px dashed ${isDragOver ? '#007aff' : '#252535'}`,
          background: isDragOver ? 'rgba(0,122,255,0.06)' : 'transparent',
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            background: isDragOver ? 'rgba(0,122,255,0.15)' : '#1a1a25',
          }}
        >
          {isDragOver ? (
            <Upload size={18} color="#007aff" />
          ) : (
            <ImagePlus size={18} color="#55556a" />
          )}
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold" style={{ color: isDragOver ? '#007aff' : '#88889a' }}>
            {isDragOver ? 'Drop to upload' : 'Upload Screenshots'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#33334a' }}>
            PNG, JPG up to 10 files
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
