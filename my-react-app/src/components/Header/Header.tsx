import React, { useState } from 'react';
import { usePixelArtStore } from '../../store/pixelArtStore';
import { saveProject, loadProject, getAllProjects, generateThumbnail } from '../../utils/db';
import { exportToPNG, generateShareLink } from '../../utils/export';
import { importImageFromFile } from '../../utils/imageImport';

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  lastModified: Date;
}

const Header: React.FC = () => {
  const { grid, canvasSize, savedStatus, markSaved, resetCanvas, setTemplate } = usePixelArtStore();
  const [projectName, setProjectName] = useState('我的像素作品');
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const handleSave = async () => {
    const thumbnail = generateThumbnail(grid, canvasSize);
    const usedColors = [...new Set(grid.flat().filter(Boolean))];
    await saveProject(projectName, grid, canvasSize, usedColors, thumbnail);
    markSaved();
    alert('作品已保存！');
  };

  const handleExport = () => {
    exportToPNG(grid, canvasSize, projectName);
  };

  const handleShare = () => {
    const link = generateShareLink(grid);
    setShareLink(link);
    setShowShareModal(true);
  };

  const handleImportImage = async () => {
    const template = await importImageFromFile();
    if (template) {
      setTemplate(template);
    }
  };

  const handleNewProject = () => {
    if (savedStatus === 'unsaved') {
      if (!window.confirm('当前作品未保存，确定要创建新项目吗？')) {
        return;
      }
    }
    resetCanvas();
    setProjectName('我的像素作品');
    setTemplate(null);
  };

  const handleLoadProjects = async () => {
    const allProjects = await getAllProjects();
    setProjects(
      allProjects.map((p) => ({
        id: p.id,
        name: p.name,
        thumbnail: p.thumbnail,
        lastModified: p.lastModified,
      }))
    );
    setShowProjects(true);
  };

  const handleLoadProject = async (id: string) => {
    const project = await loadProject(id);
    if (project) {
      const { setCanvasSize } = usePixelArtStore.getState();
      setCanvasSize(project.canvasSize as 16 | 32);
      usePixelArtStore.setState({
        grid: project.canvasData,
        savedStatus: 'saved',
      });
      setProjectName(project.name);
      setShowProjects(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('链接已复制到剪贴板！');
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>🎨 像素工坊</h1>
          <span style={styles.subtitle}>在线拼豆创作工具</span>
        </div>

        <div style={styles.projectSection}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              usePixelArtStore.setState({ savedStatus: 'unsaved' });
            }}
            style={styles.projectNameInput}
          />
          <span style={styles.saveStatus}>
            {savedStatus === 'saved' ? '✅ 已保存' : '📝 未保存'}
          </span>
        </div>

        <div style={styles.actions}>
          <button style={styles.actionButton} onClick={handleNewProject}>
            ➕ 新建
          </button>
          <button style={styles.actionButton} onClick={handleLoadProjects}>
            📂 加载
          </button>
          <button style={styles.actionButtonSecondary} onClick={handleImportImage}>
            🖼️ 导入图片
          </button>
          <button style={styles.actionButtonPrimary} onClick={handleSave}>
            💾 保存
          </button>
          <button style={styles.actionButtonSecondary} onClick={handleExport}>
            📷 导出PNG
          </button>
          <button style={styles.actionButtonSecondary} onClick={handleShare}>
            🔗 分享
          </button>
        </div>
      </header>

      {showProjects && (
        <div style={styles.modalOverlay} onClick={() => setShowProjects(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>我的作品</h2>
            {projects.length === 0 ? (
              <p style={styles.emptyText}>暂无保存的作品</p>
            ) : (
              <div style={styles.projectGrid}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={styles.projectCard}
                    onClick={() => handleLoadProject(project.id)}
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      style={styles.projectThumbnail}
                    />
                    <div style={styles.projectInfo}>
                      <span style={styles.projectName}>{project.name}</span>
                      <span style={styles.projectDate}>
                        {new Date(project.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              style={styles.closeButton}
              onClick={() => setShowProjects(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div style={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>分享作品</h2>
            <p style={styles.shareDescription}>
              复制以下链接，与朋友分享你的像素作品！
            </p>
            <div style={styles.shareLinkBox}>
              <input
                type="text"
                value={shareLink}
                readOnly
                style={styles.shareLinkInput}
              />
              <button style={styles.copyButton} onClick={handleCopyLink}>
                复制
              </button>
            </div>
            <button
              style={styles.closeButton}
              onClick={() => setShowShareModal(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #FF6B9D, #5DADE2)',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(255, 107, 157, 0.3)',
    gap: '20px',
    flexWrap: 'wrap',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.9)',
  },
  projectSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    minWidth: '200px',
    justifyContent: 'center',
  },
  projectNameInput: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
    width: '200px',
    textAlign: 'center',
  },
  saveStatus: {
    fontSize: '12px',
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '2px solid rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionButtonPrimary: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#FF6B9D',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actionButtonSecondary: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  projectCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '2px solid transparent',
  },
  projectThumbnail: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'contain',
    backgroundColor: '#fff',
  },
  projectInfo: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  projectName: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  projectDate: {
    fontSize: '11px',
    color: '#999',
  },
  shareDescription: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '16px',
  },
  shareLinkBox: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  shareLinkInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #eee',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#5DADE2',
    color: '#fff',
    fontWeight: 500,
    cursor: 'pointer',
  },
  closeButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f0f0f0',
    color: '#666',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

export default Header;
