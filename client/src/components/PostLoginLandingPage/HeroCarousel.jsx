import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/apiConfig.js';
import NewHeader from '../NewHeader.jsx';

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


// ─── SlideContent ──────────────────────────────────────────────────────────────
const SlideContent = ({ slide, isActive, direction, number }) => {
  const [mounted, setMounted] = useState(false);
  const [image, setImage] = useState();
  const [redirectLink, setRedirectLink] = useState("/");

  useEffect(() => {
    if (isActive) {
      // slight delay to trigger CSS transition after mount
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [isActive]);

  useEffect(()=>{
    const setContent = () =>{
      if(number === 0){
        setImage(slide?.image?.url);
        setRedirectLink(`/events/${slide?._id}`);
      }else{
        setImage(slide?.thumbnailUrl);
        setRedirectLink(`/research-paper/${slide?._id}`);
      }
    }

    setContent();
  })

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
          backgroundImage: `url(${image})`,
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
          alignItems: 'center',
          padding: '0 5%',
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
                fontWeight: 500,
                color: '#fff',
                letterSpacing: '0.03em',
              }}
            >
              {number===0 ? "Event" : "Publication"}
            </span>
            <span
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              margin: '0 0 24px',
              fontWeight: 400,
              fontSize: 'clamp(22px, 2.4vw, 36px)',
              color: '#fff',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}
          >
            {slide.title}
          </h2>

          <h5
            style={{
              margin: '0 0 24px',
              fontWeight: 400,
              fontSize: 'clamp(22px, 2.4vw, 20px)',
              color: '#fff',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}
          >
            {slide.subtitle}
          </h5>

          {/* Learn More button */}
          <a
            href={redirectLink || '#'}
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



// ─── HeroCarousel ──────────────────────────────────────────────────────────────
const HeroCarousel = ({ onHamburgerClick, slideContent }) => {
  const slides       = slideContent;
  const [current, setCurrent]       = useState(0);
  const [prev, setPrev]             = useState(null);
  const [direction, setDirection]   = useState('next');
  const [loading, setLoading]       = useState(false);
  const [paused, setPaused]         = useState(false);
  const timerRef                    = useRef(null);

  // ── Auto-advance ───────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    if (slides?.length < 2) return;
    setDirection('next');
    setPrev(current);
    setCurrent(c => (c + 1) % slides?.length);
  }, [current, slides?.length]);

  useEffect(() => {
    if (paused || slides?.length < 2) return;
    timerRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [advance, paused, slides?.length]);

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
      {slides?.map((slide, i) => (
        <SlideContent
          key={slide._id || i}
          number={i}
          slide={slide}
          isActive={i === current}
          direction={direction}
        />
      ))}


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
        {slides?.map((_, i) => (
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