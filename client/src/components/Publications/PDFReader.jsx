import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import axiosInstance from '../../config/apiConfig';

const PDFReader = ({ paperId, paperTitle, onClose }) => {
    const [readerUrl, setReaderUrl]   = useState(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(false);
    const [numPages, setNumPages]     = useState(null);
    const [pageWidth, setPageWidth]   = useState(800);
    const containerRef                = useRef(null);

    useEffect(() => {
        axiosInstance.get(`/api/documents/${paperId}/view-url`)
            .then(r => setReaderUrl(r.data.data.url))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [paperId]);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setPageWidth(containerRef.current.offsetWidth - 48);
            }
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [readerUrl]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#000000',
                    borderRadius: 16,
                    border: '0.5px solid #d9d9d9',
                    width: '95vw',
                    height: '95vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 28px',
                    borderBottom: '0.5px solid #d9d9d9',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 11,
                            fontWeight: 300,
                            color: '#d9d9d9',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}>
                            Reading
                        </span>
                        <span style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#ffffff',
                        }}>
                            {paperTitle}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '0.5px solid #d9d9d9',
                            borderRadius: 8,
                            padding: '6px 14px',
                            color: '#d9d9d9',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#d9d9d9';
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* Scrollable PDF area */}
                <div
                    ref={containerRef}
                    style={{
                        overflowY: 'auto',
                        flex: 1,
                        minHeight: 0,
                        padding: '24px',
                        position: 'relative',
                    }}
                >
                    {loading && (
                        <div style={styles.centered}>
                            <span style={styles.statusText}>Loading publication…</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div style={styles.centered}>
                            <span style={styles.statusText}>Could not load publication.</span>
                        </div>
                    )}

                    {readerUrl && (
                        <Document
                            file={readerUrl}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={null}
                            error={
                                <div style={styles.centered}>
                                    <span style={styles.statusText}>Could not render PDF.</span>
                                </div>
                            }
                        >
                            {Array.from({ length: numPages ?? 0 }, (_, i) => (
                                <div key={i + 1} style={{ marginBottom: 16 }}>
                                    <Page
                                        pageNumber={i + 1}
                                        width={pageWidth}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={true}
                                    />
                                </div>
                            ))}
                        </Document>
                    )}

                    {/* Subtle scroll-hint fade at the very bottom */}
                    <div style={{
                        position: 'sticky',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 64,
                        background: 'linear-gradient(to bottom, transparent, #000000)',
                        pointerEvents: 'none',
                        marginTop: -64,
                    }} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    centered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 200,
    },
    statusText: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: '#d9d9d9',
    },
};

export default PDFReader;
