'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useCallback, useRef } from 'react'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichEditor({ value, onChange }: RichEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addImage = useCallback(async (file: File) => {
    if (!editor) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/products/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 10px',
    border: '1px solid #E8E4DD',
    borderRadius: 4,
    background: active ? '#1e2025' : 'white',
    color: active ? 'white' : '#1e2025',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: PRETENDARD,
    fontWeight: 600,
  })

  return (
    <div style={{ border: '1px solid #E8E4DD', borderRadius: 8, overflow: 'hidden' }}>
      {/* 툴바 */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #E8E4DD', background: '#F8F6F2', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        
        {/* 텍스트 스타일 */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...btnStyle(editor.isActive('italic')), fontStyle: 'italic' }}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} style={{ ...btnStyle(editor.isActive('strike')), textDecoration: 'line-through' }}>S</button>

        <div style={{ width: 1, background: '#E8E4DD', margin: '0 4px' }} />

        {/* 헤딩 */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive('heading', { level: 3 }))}>H3</button>

        <div style={{ width: 1, background: '#E8E4DD', margin: '0 4px' }} />

        {/* 정렬 */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={btnStyle(editor.isActive({ textAlign: 'left' }))}>←</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={btnStyle(editor.isActive({ textAlign: 'center' }))}>↔</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={btnStyle(editor.isActive({ textAlign: 'right' }))}>→</button>

        <div style={{ width: 1, background: '#E8E4DD', margin: '0 4px' }} />

        {/* 리스트 */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))}>• 목록</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))}>1. 목록</button>

        <div style={{ width: 1, background: '#E8E4DD', margin: '0 4px' }} />

        {/* 색상 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12, color: '#8a9099', fontFamily: PRETENDARD }}>색상</span>
          <input type="color" onChange={e => editor.chain().focus().setColor(e.target.value).run()}
            style={{ width: 28, height: 28, border: '1px solid #E8E4DD', borderRadius: 4, cursor: 'pointer', padding: 2 }} />
        </div>

        <div style={{ width: 1, background: '#E8E4DD', margin: '0 4px' }} />

        {/* 이미지 */}
        <button type="button" onClick={() => imageInputRef.current?.click()}
          style={btnStyle(false)}>
          📷 이미지
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = '' }} />

        {/* 구분선 */}
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)}>— 구분선</button>
      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} style={{ minHeight: 300, padding: 16, fontFamily: PRETENDARD, fontSize: 14, lineHeight: 1.8 }} />

      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror p { margin: 0.5em 0; }
        .ProseMirror h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
        .ProseMirror h3 { font-size: 1.2em; font-weight: 700; margin: 0.5em 0; }
        .ProseMirror ul { padding-left: 1.5em; list-style: disc; }
        .ProseMirror ol { padding-left: 1.5em; list-style: decimal; }
        .ProseMirror img { max-width: 100%; border-radius: 6px; margin: 8px 0; }
        .ProseMirror hr { border: none; border-top: 1px solid #E8E4DD; margin: 16px 0; }
      `}</style>
    </div>
  )
}
