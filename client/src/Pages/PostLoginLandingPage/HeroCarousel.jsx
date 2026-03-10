import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Logo from '../../components/Logo.jsx';
import ProfileDrawer from '../../components/ProfileDrawer.jsx';
import axiosInstance from '../../config/apiConfig.js';

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const B = {
  textInverse:      '#161616',
  grey600:          '#888',
  blue:             '#004aad',
  blue2nd:          '#062c65',
  grey200:          '#d9d9d9',
  grey400:          '#adadad',
  grey50:           '#f6f5f5',
  bgSecondary:      '#474646',
  textPrimary:      '#fff',
  buttonSecondary:  '#6f6f6f',
  buttonHover:      '#062c65',
  buttonPrimary:    '#105abd',
  textOnColor:      '#fff',
  textSecondary:    '#9f9f9f',
};

const SLIDE_INTERVAL = 8000; // 8 seconds

// ─── PostLoginNavbar ───────────────────────────────────────────────────────────
const PostLoginNavbar = ({ onHamburgerClick }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Blue announcement bar */}
      <div
        style={{
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(to right, ${B.blue}, ${B.blue2nd})`,
          color: '#fff',
          fontSize: 12.5,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <a
          href="https://docsend.com/view/8ken6c6i84m8bwcu"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            textDecoration: 'none',
            gap: 4,
          }}
          onMouseEnter={e => e.currentTarget.querySelector('span').style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.querySelector('span').style.textDecoration = 'none'}
        >
          <span>Join The Institutional Research Network.</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </a>
      </div>

      {/* Main transparent nav — padded to 5% to align with text block */}
      <div
        style={{
          width: '100%',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '5%',
          paddingRight: '5%',
          marginTop: 10,
          background: 'transparent',
          boxSizing: 'border-box',
        }}
      >
        {/* Hamburger — left, aligned to 5% edge */}
        <button
          onClick={onHamburgerClick}
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: 6,
            borderRadius: 6,
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu size={24} strokeWidth={1.8} />
        </button>

        {/* Logo — centered absolutely so it doesn't affect flex spacing */}
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Logo />
        </div>

        {/* Profile — right, aligned to 5% edge */}
        <ProfileDrawer />
      </div>
    </div>
  );
};

// ─── SlideContent ──────────────────────────────────────────────────────────────
const SlideContent = ({ slide, isActive, direction }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isActive) {
      // slight delay to trigger CSS transition after mount
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [isActive]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transition: 'transform 0.7s cubic-bezier(0.77,0,0.18,1), opacity 0.7s ease',
        transform: isActive
          ? 'translateX(0%)'
          : direction === 'next'
          ? 'translateX(100%)'
          : 'translateX(-100%)',
        opacity: isActive ? 1 : 0,
        willChange: 'transform, opacity',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Dark flat overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.52)',
        }}
      />

      {/* Edge gradients — top */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 18%, transparent 42%)',
        zIndex: 2,
      }} />
      {/* Edge gradients — bottom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 18%, transparent 42%)',
        zIndex: 2,
      }} />
      {/* Edge gradients — left */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 18%, transparent 42%)',
        zIndex: 2,
      }} />
      {/* Edge gradients — right */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 18%, transparent 42%)',
        zIndex: 2,
      }} />

      {/* Text content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 5% 60px',
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: '45%',
            minWidth: 280,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
            opacity: mounted ? 1 : 0,
            transition: 'transform 0.65s ease 0.25s, opacity 0.65s ease 0.25s',
          }}
        >
          {/* Badge row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                border: '1px solid rgba(255,255,255,0.75)',
                borderRadius: 999,
                fontSize: 12,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                color: '#fff',
                letterSpacing: '0.03em',
              }}
            >
              Highlight
            </span>
            <span
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {slide.category}
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              margin: '0 0 24px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(22px, 2.4vw, 36px)',
              color: '#fff',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}
          >
            {slide.title}
          </h2>

          {/* Learn More button */}
          <a
            href={slide.link || '#'}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              backgroundColor: B.buttonPrimary,
              color: '#fff',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 4,
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = B.buttonHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = B.buttonPrimary}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Fallback Slides ──────────────────────────────────────────────────────────
const FALLBACK_SLIDES = [
  {
    _id:      'fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80',
    category: 'Publication',
    title:    'AI in Healthcare is Reshaping Clinical Decision Making Across the Globe',
    link:     '/publications',
  },
  {
    _id:      'fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80',
    category: 'Event',
    title:    'The Future of Renewable Energy is Driving the Next Industrial Revolution',
    link:     '/events',
  },
];

// ─── HeroCarousel ──────────────────────────────────────────────────────────────
const HeroCarousel = ({ onHamburgerClick }) => {
  const [slides, setSlides]         = useState(FALLBACK_SLIDES);
  const [current, setCurrent]       = useState(0);
  const [prev, setPrev]             = useState(null);
  const [direction, setDirection]   = useState('next');
  const [loading, setLoading]       = useState(false);
  const [paused, setPaused]         = useState(false);
  const timerRef                    = useRef(null);

  // ── Fetch highlights from API ──────────────────────────────────────────────
  /* useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        // PLACEHOLDER ENDPOINT — replace with actual endpoint
        const res = await axiosInstance.get('/api/highlights/personalized');
        const data = res.data.data;
        // Use API data if available, otherwise fall back to static slides
        setSlides(data && data.length > 0 ? data : FALLBACK_SLIDES);
      } catch (err) {
        console.error('Failed to fetch highlights, using fallback:', err);
        setSlides(FALLBACK_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []); */

  // ── Auto-advance ───────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    if (slides.length < 2) return;
    setDirection('next');
    setPrev(current);
    setCurrent(c => (c + 1) % slides.length);
  }, [current, slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    timerRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [advance, paused, slides.length]);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PostLoginNavbar onHamburgerClick={onHamburgerClick} />
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid rgba(255,255,255,0.2)`,
            borderTopColor: B.buttonPrimary,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <SlideContent
          key={slide._id || i}
          slide={slide}
          isActive={i === current}
          direction={direction}
        />
      ))}

      {/* Navbar — sits above slides */}
      <PostLoginNavbar onHamburgerClick={onHamburgerClick} />

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '5%',
          display: 'flex',
          gap: 8,
          zIndex: 20,
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              width:  i === current ? 22 : 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'width 0.4s ease, background-color 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-text-block {
            width: 85% !important;
            min-width: unset !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;