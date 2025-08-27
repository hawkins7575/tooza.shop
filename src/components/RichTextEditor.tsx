import React, { useState, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "내용을 입력하세요", 
  minHeight = "300px" 
}: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showYouTubeDialog, setShowYouTubeDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 텍스트 영역에서 현재 커서 위치 가져오기
  const getCursorPosition = () => {
    if (textareaRef.current) {
      return textareaRef.current.selectionStart
    }
    return 0
  }

  // 특정 위치에 텍스트 삽입
  const insertTextAtCursor = (insertText: string) => {
    const cursorPosition = getCursorPosition()
    const newValue = 
      value.slice(0, cursorPosition) + 
      insertText + 
      value.slice(cursorPosition)
    
    onChange(newValue)
    
    // 커서 위치를 삽입된 텍스트 뒤로 이동
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = cursorPosition + insertText.length
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  // 선택된 텍스트를 특정 마크다운으로 감싸기
  const wrapSelectedText = (prefix: string, suffix: string = '') => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selectedText = value.slice(start, end)
      
      if (selectedText) {
        const wrappedText = prefix + selectedText + (suffix || prefix)
        const newValue = 
          value.slice(0, start) + 
          wrappedText + 
          value.slice(end)
        
        onChange(newValue)
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            textareaRef.current.setSelectionRange(
              start + prefix.length, 
              start + prefix.length + selectedText.length
            )
          }
        }, 0)
      } else {
        insertTextAtCursor(prefix + suffix)
      }
    }
  }

  // 이미지 삽입
  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      const imageMarkdown = `![이미지](${imageUrl.trim()})`
      insertTextAtCursor(imageMarkdown)
      setImageUrl('')
      setShowImageDialog(false)
    }
  }

  // 유튜브 URL에서 비디오 ID 추출
  const extractYouTubeId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // 유튜브 비디오 삽입
  const handleInsertYouTube = () => {
    if (youtubeUrl.trim()) {
      const videoId = extractYouTubeId(youtubeUrl.trim())
      if (videoId) {
        const youtubeMarkdown = `[🎥 YouTube 비디오](https://www.youtube.com/watch?v=${videoId})

<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>

---`
        insertTextAtCursor(youtubeMarkdown)
        setYoutubeUrl('')
        setShowYouTubeDialog(false)
      } else {
        alert('올바른 YouTube URL을 입력해주세요.')
      }
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* 툴바 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.75rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #d1d5db',
        borderBottom: 'none',
        borderRadius: '0.5rem 0.5rem 0 0'
      }}>
        {/* 텍스트 서식 */}
        <button
          type="button"
          onClick={() => wrapSelectedText('**')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          title="굵게"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => wrapSelectedText('*')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontStyle: 'italic'
          }}
          title="기울임"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => wrapSelectedText('`')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
          title="코드"
        >
          {'<>'}
        </button>

        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 0.25rem' }} />

        {/* 제목 */}
        <button
          type="button"
          onClick={() => insertTextAtCursor('\n## ')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="제목"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => insertTextAtCursor('\n### ')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="소제목"
        >
          H3
        </button>

        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 0.25rem' }} />

        {/* 목록 */}
        <button
          type="button"
          onClick={() => insertTextAtCursor('\n- ')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="불릿 목록"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => insertTextAtCursor('\n1. ')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="번호 목록"
        >
          1. List
        </button>

        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 0.25rem' }} />

        {/* 미디어 삽입 */}
        <button
          type="button"
          onClick={() => setShowImageDialog(true)}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            color: '#059669'
          }}
          title="이미지 삽입"
        >
          🖼️ 이미지
        </button>

        <button
          type="button"
          onClick={() => setShowYouTubeDialog(true)}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            color: '#dc2626'
          }}
          title="YouTube 비디오 삽입"
        >
          🎥 YouTube
        </button>

        <div style={{ width: '1px', backgroundColor: '#d1d5db', margin: '0 0.25rem' }} />

        {/* 기타 */}
        <button
          type="button"
          onClick={() => insertTextAtCursor('\n---\n')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="구분선"
        >
          ━━━
        </button>

        <button
          type="button"
          onClick={() => insertTextAtCursor('\n> ')}
          style={{
            padding: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
          title="인용문"
        >
          💬 Quote
        </button>
      </div>

      {/* 텍스트 에디터 */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight,
          padding: '1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0 0 0.5rem 0.5rem',
          fontSize: '1rem',
          lineHeight: '1.5',
          resize: 'vertical',
          fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'
        }}
      />

      {/* 이미지 삽입 다이얼로그 */}
      {showImageDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              🖼️ 이미지 삽입
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                이미지 URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                autoFocus
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                이미지의 URL을 입력하세요. JPG, PNG, GIF, WebP 등 지원
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: imageUrl.trim() ? '#059669' : '#9ca3af',
                  color: 'white',
                  borderRadius: '0.5rem',
                  cursor: imageUrl.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                삽입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube 삽입 다이얼로그 */}
      {showYouTubeDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              🎥 YouTube 비디오 삽입
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                autoFocus
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                지원 형식: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowYouTubeDialog(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleInsertYouTube}
                disabled={!youtubeUrl.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: youtubeUrl.trim() ? '#dc2626' : '#9ca3af',
                  color: 'white',
                  borderRadius: '0.5rem',
                  cursor: youtubeUrl.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                삽입
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 도움말 */}
      <div style={{ 
        fontSize: '0.75rem', 
        color: '#6b7280', 
        marginTop: '0.5rem',
        lineHeight: '1.4'
      }}>
        💡 <strong>사용법:</strong> 텍스트를 선택한 후 서식 버튼을 누르거나, 커서 위치에 직접 삽입할 수 있습니다. 
        마크다운 문법도 지원합니다.
      </div>
    </div>
  )
}