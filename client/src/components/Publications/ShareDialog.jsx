import { useState } from 'react';
import axiosInstance from '../../config/apiConfig';

/* ── Inline SVG icons ─────────────────────────────────────────────────── */

const IconEmail = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
    </svg>
);

const IconWhatsApp = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const IconSlack = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
);

const IconLinkedIn = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const IconX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.741-8.851L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const IconFacebook = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const IconLink = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
);

/* ── Component ────────────────────────────────────────────────────────── */

const ShareDialog = ({ url, title, paperId, onClose }) => {
    const [copied, setCopied]           = useState(false);
    const [slackCopied, setSlackCopied] = useState(false);

    const trackShare = () => {
        axiosInstance.post(`/api/documents/${paperId}/track-share`).catch(() => {});
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            trackShare();
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // clipboard unavailable
        }
    };

    const platforms = [
        {
            name: 'Email',
            Icon: IconEmail,
            action: () => {
                window.open(
                    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this publication: ${url}`)}`,
                    '_blank'
                );
                trackShare();
            },
        },
        {
            name: 'WhatsApp',
            Icon: IconWhatsApp,
            action: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank');
                trackShare();
            },
        },
        {
            name: 'Slack',
            Icon: IconSlack,
            action: () => {
                navigator.clipboard.writeText(url).catch(() => {});
                setSlackCopied(true);
                window.open('https://slack.com', '_blank');
                trackShare();
                setTimeout(() => setSlackCopied(false), 3000);
            },
        },
        {
            name: 'LinkedIn',
            Icon: IconLinkedIn,
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                trackShare();
            },
        },
        {
            name: 'X',
            Icon: IconX,
            action: () => {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                    '_blank'
                );
                trackShare();
            },
        },
        {
            name: 'Facebook',
            Icon: IconFacebook,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                trackShare();
            },
        },
    ];

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#000000',
                    borderRadius: 25,
                    border: '0.5px solid #d9d9d9',
                    width: '100%',
                    maxWidth: 480,
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
                            Share
                        </span>
                        <span style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#ffffff',
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {title}
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

                {/* Platform grid */}
                <div style={{
                    padding: '24px 28px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                }}>
                    {platforms.map(({ name, Icon, action }) => (
                        <button
                            key={name}
                            onClick={action}
                            style={{
                                background: 'transparent',
                                border: '0.5px solid #d9d9d9',
                                borderRadius: 12,
                                padding: '16px 8px',
                                color: '#ffffff',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'background 0.2s ease, border-color 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#1a1a1a';
                                e.currentTarget.style.borderColor = '#ffffff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = '#d9d9d9';
                            }}
                        >
                            <Icon />
                            {name === 'Slack' && slackCopied ? 'Link copied!' : name}
                        </button>
                    ))}
                </div>

                {/* Copy link row */}
                <div style={{ padding: '0 28px 24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: '#111111',
                        borderRadius: 12,
                        border: '0.5px solid #333333',
                        padding: '10px 14px',
                    }}>
                        <span style={{ color: '#d9d9d9', flexShrink: 0 }}>
                            <IconLink />
                        </span>
                        <span style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 12,
                            fontWeight: 300,
                            color: '#d9d9d9',
                        }}>
                            {url}
                        </span>
                        <button
                            onClick={handleCopy}
                            style={{
                                flexShrink: 0,
                                background: copied ? '#004aad' : 'transparent',
                                border: `0.5px solid ${copied ? '#004aad' : '#d9d9d9'}`,
                                borderRadius: 8,
                                padding: '6px 14px',
                                color: copied ? '#ffffff' : '#d9d9d9',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {copied ? 'Copied!' : 'Copy link'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareDialog;
