import React, { useState } from 'react';
import { usePixelArtStore } from '../../store/pixelArtStore';
import type { Tool, CanvasSize } from '../../store/pixelArtStore';
import { TEMPLATES } from '../../utils/templates';

const Toolbar: React.FC = () => {
  const {
    currentTool,
    setCurrentTool,
    canvasSize,
    setCanvasSize,
    undo,
    redo,
    history,
    historyIndex,
    clearCanvas,
    setTemplate,
    template,
  } = usePixelArtStore();

  const [showTemplates, setShowTemplates] = useState(false);

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'brush', name: '画笔', icon: '🖌️' },
    { id: 'eraser', name: '橡皮擦', icon: '🧹' },
    { id: 'fill', name: '填充', icon: '🪣' },
  ];

  const handleCanvasSizeChange = (size: CanvasSize) => {
    if (window.confirm('更改画布大小将清空当前作品，确定继续吗？')) {
      setCanvasSize(size);
    }
  };

  const handleTemplateSelect = (templateData: (string | null)[][]) => {
    setTemplate(templateData as string[][]);
    setShowTemplates(false);
  };

  const handleClearCanvas = () => {
    if (window.confirm('确定要清空画布吗？此操作不可撤销。')) {
      clearCanvas();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>工具</h3>
        <div style={styles.toolGrid}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              style={{
                ...styles.toolButton,
                backgroundColor: currentTool === tool.id ? '#FF6B9D' : '#f0f8ff',
                color: currentTool === tool.id ? '#fff' : '#333',
              }}
              onClick={() => setCurrentTool(tool.id)}
            >
              <span style={styles.toolIcon}>{tool.icon}</span>
              <span style={styles.toolName}>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>画布大小</h3>
        <div style={styles.sizeButtons}>
          {([16, 32] as CanvasSize[]).map((size) => (
            <button
              key={size}
              style={{
                ...styles.sizeButton,
                backgroundColor: canvasSize === size ? '#5DADE2' : '#f0f8ff',
                color: canvasSize === size ? '#fff' : '#333',
              }}
              onClick={() => handleCanvasSizeChange(size)}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>历史记录</h3>
        <div style={styles.historyButtons}>
          <button
            style={{
              ...styles.historyButton,
              opacity: historyIndex > 0 ? 1 : 0.4,
            }}
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            ↩️ 撤销
          </button>
          <button
            style={{
              ...styles.historyButton,
              opacity: historyIndex < history.length - 1 ? 1 : 0.4,
            }}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            ↪️ 重做
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>模板库</h3>
        <button
          style={{
            ...styles.templateButton,
            backgroundColor: template ? '#58D68D' : '#f0f8ff',
            color: template ? '#fff' : '#333',
          }}
          onClick={() => setShowTemplates(!showTemplates)}
        >
          📋 {template ? '已加载模板' : '选择模板'}
        </button>
        {showTemplates && (
          <div style={styles.templateList}>
            <button
              style={styles.templateItem}
              onClick={() => {
                setTemplate(null);
                setShowTemplates(false);
              }}
            >
              无模板
            </button>
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                style={styles.templateItem}
                onClick={() => handleTemplateSelect(t.data)}
              >
                {t.name} ({t.category})
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <button style={styles.clearButton} onClick={handleClearCanvas}>
          🗑️ 清空画布
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '180px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
    margin: 0,
    paddingBottom: '4px',
    borderBottom: '1px solid #eee',
  },
  toolGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  toolButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
  },
  toolIcon: {
    fontSize: '18px',
  },
  toolName: {
    fontWeight: 500,
  },
  sizeButtons: {
    display: 'flex',
    gap: '8px',
  },
  sizeButton: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  historyButtons: {
    display: 'flex',
    gap: '8px',
  },
  historyButton: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s',
  },
  templateButton: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  templateList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  templateItem: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    transition: 'background 0.2s',
  },
  clearButton: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#FFE4E1',
    color: '#E74C3C',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'all 0.2s',
  },
};

export default Toolbar;
