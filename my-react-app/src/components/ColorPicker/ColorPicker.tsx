import React, { useState } from 'react';
import { usePixelArtStore } from '../../store/pixelArtStore';
import { COLOR_PALETTE } from '../../utils/templates';

const ColorPicker: React.FC = () => {
  const { currentColor, setCurrentColor } = usePixelArtStore();
  const [customColor, setCustomColor] = useState('#FF6B9D');

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>颜色选择</h3>
      <div style={styles.palette}>
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            style={{
              ...styles.colorButton,
              backgroundColor: color,
              transform: currentColor === color ? 'scale(1.15)' : 'scale(1)',
              boxShadow: currentColor === color
                ? `0 0 0 3px #ffffff, 0 0 0 5px ${color}`
                : '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onClick={() => setCurrentColor(color)}
            title={color}
          />
        ))}
      </div>
      <div style={styles.customColorSection}>
        <label style={styles.label}>自定义颜色</label>
        <div style={styles.customColorRow}>
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            style={styles.colorInput}
          />
          <button
            style={{
              ...styles.addButton,
              background: `linear-gradient(135deg, ${customColor}, ${customColor}dd)`,
            }}
            onClick={() => setCurrentColor(customColor)}
          >
            使用此颜色
          </button>
        </div>
      </div>
      <div style={styles.currentColorSection}>
        <label style={styles.label}>当前颜色</label>
        <div style={styles.currentColorPreview}>
          <div
            style={{
              ...styles.currentColorBox,
              backgroundColor: currentColor,
            }}
          />
          <span style={styles.currentColorText}>{currentColor}</span>
        </div>
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
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  palette: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px',
  },
  colorButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  customColorSection: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
  },
  customColorRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  colorInput: {
    width: '40px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  addButton: {
    flex: 1,
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  currentColorSection: {
    borderTop: '1px solid #eee',
    paddingTop: '12px',
  },
  currentColorPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  currentColorBox: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  currentColorText: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#333',
  },
};

export default ColorPicker;
