import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import axiosInstance from '../../config/apiConfig';

const PDFPreview = ({ paperId }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(false);
    const [pageWidth, setPageWidth]   = useState(600);

    // Fetch the public preview URL on mount
    useEffect(() => {
        axiosInstance.get(`/api/documents/${paperId}/view-url`)
            .then(r => setPreviewUrl(r.data.data.url))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [paperId]);

    // Responsive width — fit within the container
    useEffect(() => {
        const handleResize = () => {
            const container = document.getElementById('pdf-preview-container');
            if (container) setPageWidth(container.offsetWidth);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return (
        <div style={styles.placeholder}>
            <div style={styles.placeholderText}>Loading preview…</div>
        </div>
    );

    if (error || !previewUrl) return (
        <div style={styles.placeholder}>
            <div style={styles.placeholderText}>Preview unavailable.</div>
        </div>
    );

    return (
        <div style={styles.wrapper}>
            

            {/* PDF page */}
            <div
                id="pdf-preview-container"
                style={styles.pageContainer}
            >
                <Document
                    file={previewUrl}
                    loading={null}
                    error={
                        <div style={styles.placeholderText}>
                            Could not load preview.
                        </div>
                    }
                >
                    <Page
                        pageNumber={1}
                        width={pageWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                    <Page
                        pageNumber={2}
                        width={pageWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                    <Page
                        pageNumber={3}
                        width={pageWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />

                    <Page
                        pageNumber={4}
                        width={pageWidth}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>

                {/* Fade overlay at the bottom */}
                <div style={styles.fadeOverlay} />
            </div>

            
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
    },
    labelRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
    },
    label: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
    labelSub: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        color: '#d9d9d9',
    },
    pageContainer: {
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: '0.5px solid #d9d9d9',
    },
    fadeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '45%',
        background: 'linear-gradient(to bottom, transparent, #000000)',
        pointerEvents: 'none',
    },
    ctaRow: {
        padding: '10px 0',
        borderTop: '0.5px solid #d9d9d9',
    },
    ctaText: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        fontWeight: 300,
        color: '#d9d9d9',
    },
    placeholder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        borderRadius: 8,
        border: '0.5px solid #d9d9d9',
        marginTop: 32,
    },
    placeholderText: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: '#d9d9d9',
    },
};

export default PDFPreview;