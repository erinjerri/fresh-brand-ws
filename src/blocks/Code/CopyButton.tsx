'use client'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [text, setText] = useState('Copy')

  function updateCopyStatus() {
    if (text === 'Copy') {
      setText(() => 'Copied!')
      setTimeout(() => {
        setText(() => 'Copy')
      }, 1000)
    }
  }

  return (
    <div className="flex justify-end align-middle">
      <button
        className="flex gap-1 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-sm font-medium"
        onClick={async () => {
          await navigator.clipboard.writeText(code)
          updateCopyStatus()
        }}
      >
        <p>{text}</p>
        <span>📋</span>
      </button>
    </div>
  )
}
