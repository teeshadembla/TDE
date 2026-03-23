import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Monitor, MapPin } from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import DataProvider from '../../context/DataProvider.jsx';


// ─── Date / Time Helpers ───────────────────────────────────────────────────────

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  });

const formatDateRange = (startStr, endStr) => {
  const start = new Date(startStr);
  const end   = new Date(endStr);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth()    === end.getMonth()    &&
    start.getDate()     === end.getDate();

  if (sameDay) return formatDate(startStr);

  const startFmt = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endFmt   = end.toLocaleDateString('en-US',   { day: 'numeric', year: 'numeric' });
  return `${startFmt} – ${endFmt}`;
};

const formatTime = (startStr, endStr) => {
  const fmt = (d) =>
    new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  return `${fmt(startStr)} – ${fmt(endStr)} EST`;
};

const isMultiDay = (startStr, endStr) => {
  const s = new Date(startStr);
  const e = new Date(endStr);
  return s.getDate() !== e.getDate() || s.getMonth() !== e.getMonth();
};

// ─── EventCard ────────────────────────────────────────────────────────────────
// Figma specs: 1107×445px, radius 20px
// Overlay: #000000 at 50% → #000000 at 100% (top to bottom)
// Buttons: 140.65×34px, radius 5px
// Button text: Plus Jakarta Sans, weight 500, 15px
// Badge container: 413×30px, radius 100px, border 0.5px #D9D9D9
const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  const start = event?.eventDate?.start;
  const end = event?.eventDate?.end;
  const multiDay = end ? isMultiDay(start, end) : false;
  const handleRegister = () => {
    if (event.registrationLink && event.registrationLink !== '#') {
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    }
  };


  return (
    // Card: 1107px wide in Figma, full width responsively, 445px height, radius 20px
    <div className="relative w-full rounded-[20px] overflow-hidden" style={{ height: '445px' }}>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${event?.image?.url})` }}
      />

      {/* Dark overlay — #000000 50% at top to #000000 100% at bottom */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,1) 100%)' }}
      />

      {/* Content — pinned to bottom-left, left: 76px matches Figma badge left position */}
      <div className="absolute inset-0 flex flex-col justify-end pb-[28px] pl-[76px] pr-[76px]">

        {/* Badge pills container — height 30px, radius 100px, border 0.5px #D9D9D9 */}
        {/* Each pill is inline, container wraps them in a flex row */}
        <div className="flex flex-wrap items-center gap-2 mb-4" style={{ minHeight: '30px' }}>
          {/* Type badge */}
          <span
            className="flex items-center px-4 text-white capitalize text-[13px] font-medium bg-black/65 backdrop-blur-sm"
            style={{
              height:       '30px',
              borderRadius: '100px',
              border:       '0.5px solid #D9D9D9',
            }}
          >
            {event.type}
          </span>

          {/* Workgroup badges */}
          {event.workgroupTitles && event.workgroupTitles.map((wg, i) => (
            <span
              key={i}
              className="flex items-center px-4 text-white text-[13px] font-medium bg-black/65 backdrop-blur-sm"
              style={{
                height:       '30px',
                borderRadius: '100px',
                border:       '0.5px solid #D9D9D9',
              }}
            >
              {wg.title || wg}
            </span>
          ))}
        </div>

        {/* Title — Heading 3: Plus Jakarta Sans, regular 400, 30px, line height 100% */}
        <h3
          className="text-white font-normal m-0 mb-4 max-w-[75%]"
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize:   '30px',
            lineHeight: '100%',
            fontWeight: 400,
          }}
        >
          {event.title}
        </h3>

        {/* Meta row — date/time + virtual/location */}
        <div className="flex flex-wrap items-center gap-6 mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={15} strokeWidth={1.8} color="white" className="shrink-0" />
            <span
              className="text-white font-light"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}
            >
              {multiDay
                ? formatDateRange(start, end)
                : `${formatDate(start)} | ${formatTime(start, end || start)}`
              }
            </span>
          </div>


            <div className="flex items-center gap-2">
              <MapPin size={15} strokeWidth={1.8} color="white" className="shrink-0" />
              <span
                className="text-white font-light"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' }}
              >
                {event.location}
              </span>
            </div>
        </div>

        {/* Buttons — both 140.65×34px, radius 5px, text: Plus Jakarta Sans 500 15px */}
        <div className="flex items-center gap-3">

          {/* Register Here — bg #004AAD */}
          <button
            onClick={handleRegister}
            className="flex items-center justify-center text-white cursor-pointer border-0 transition-colors duration-200 hover:bg-[#062c65]"
            style={{
              width:        '140.65px',
              height:       '34px',
              borderRadius: '5px',
              backgroundColor: '#004AAD',
              fontFamily:   'Plus Jakarta Sans, sans-serif',
              fontWeight:   500,
              fontSize:     '15px',
              lineHeight:   '100%',
              flexShrink:   0,
            }}
          >
            Register Here
          </button>

          {/* View Details — bg transparent, border 0.5px #D9D9D9 */}
          <button
            onClick={() => navigate(`/events/${event._id}`)}
            className="flex items-center justify-center text-white cursor-pointer bg-transparent transition-colors duration-200 hover:bg-white/10"
            style={{
              width:        '140.65px',
              height:       '34px',
              borderRadius: '5px',
              border:       '0.5px solid #D9D9D9',
              fontFamily:   'Plus Jakarta Sans, sans-serif',
              fontWeight:   500,
              fontSize:     '15px',
              lineHeight:   '100%',
              flexShrink:   0,
            }}
          >
            View Details
          </button>

        </div>
      </div>
    </div>
  );
};

// ─── UpcomingEvents ────────────────────────────────────────────────────────────
// Outer container: 1244×643px, radius 25px, border 0.5px
// Border gradient: #666666 → #808080
// Fill gradient: #000000 → #003172
// Section title: Plus Jakarta Sans 400, 35px, line height 100%, #FFFFFF
// Arrow buttons: 35×35px
// Greeting: Plus Jakarta Sans 400, 35px — same spec as title row
const UpcomingEvents = ({eventsContent}) => {
  const { account }           = useContext(DataProvider.DataContext);
  const events = eventsContent
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [animDir, setAnimDir] = useState(null); // 'next' | 'prev'

  // Extract first name from full name stored in context
  const firstName = (account?.name || account?.FullName || 'there').split(' ')[0];


  // ── Animated navigation ────────────────────────────────────────────────
  const goTo = useCallback((dir) => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setCurrent(c =>
        dir === 'next'
          ? (c + 1) % events.length
          : (c - 1 + events.length) % events.length
      );
      setVisible(true);
      setAnimDir(null);
    }, 280);
  }, [events.length]);

  return (
    <section
      className="w-full bg-black pt-[150px]"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Centered container — max 1248px, 40px side padding per layout doc */}
      <div className="max-w-[1248px] mx-auto px-5 md:px-10">

        {/* ── Greeting row ────────────────────────────────────────────── */}
        {/* Spec matches "Upcoming Events" title row: Plus Jakarta Sans 400, 35px */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">

            {/* Avatar circle */}
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shrink-0">
              {account?.profilePicture ? (
                <img
                  src={account.profilePicture}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-white font-bold text-sm"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {firstName[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Greeting text — Plus Jakarta Sans 400, 35px, line height 100% */}
            <span
              className="text-white"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize:   '35px',
                lineHeight: '100%',
              }}
            >
              Hello, {firstName}!
            </span>
          </div>

          {/* Add Practice Area — uncomment when feature is defined */}
          {/*
          <button className="flex items-center gap-2 bg-transparent border-0 text-white cursor-pointer"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 400, fontSize: '14px' }}>
            <PlusCircle size={18} strokeWidth={1.5} />
            Add Practice Area
          </button>
          */}
        </div>

        {/* ── Outer events card ────────────────────────────────────────── */}
        {/* Figma: 1244×643px, radius 25px, border 0.5px gradient #666666→#808080 */}
        {/* Fill: linear gradient #000000→#003172 */}
        <div
          className="rounded-[25px] p-7"
          style={{
            background: 'linear-gradient(-45deg, #000000 0%, #003172 100%)',
            borderImage:'linear-gradient(135deg, #666666, #808080)',
            // borderImage doesn't work with border-radius, so use outline or box-shadow trick:
            boxShadow:  '0 0 0 0.5px #707070',
            borderImageSlice: 1,
          }}
        >
          {/* Card header — title left, arrows right */}
          <div className="flex items-center justify-between mb-5">

            {/* Title: Plus Jakarta Sans 400, 35px, line height 100%, #FFFFFF */}
            <h2
              className="text-white m-0"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize:   '35px',
                lineHeight: '100%',
              }}
            >
              Upcoming Events
            </h2>

            {/* Arrow buttons — Figma: 35×35px each */}
            <div className="flex gap-2">
              <button
                onClick={() => goTo('prev')}
                aria-label="Previous event"
                className="flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 rounded-full transition-colors duration-150 cursor-pointer"
                style={{ width: '35px', height: '35px', flexShrink: 0 }}
              >
                <ChevronLeft size={16} strokeWidth={2} color="white" />
              </button>
              <button
                onClick={() => goTo('next')}
                aria-label="Next event"
                className="flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 rounded-full transition-colors duration-150 cursor-pointer"
                style={{ width: '35px', height: '35px', flexShrink: 0 }}
              >
                <ChevronRight size={16} strokeWidth={2} color="white" />
              </button>
            </div>
          </div>

          {/* Animated event card wrapper */}
          <div
            className="transition-all duration-[280ms] ease-in-out"
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible
                ? 'translateX(0px)'
                : animDir === 'next'
                ? 'translateX(-24px)'
                : 'translateX(24px)',
            }}
          >
            {loading ? (
              // Loading skeleton — same dimensions as card
              <div
                className="w-full rounded-[20px] bg-white/5 flex items-center justify-center"
                style={{ height: '445px' }}
              >
                <div className="w-9 h-9 rounded-full border-[3px] border-white/15 border-t-[#004AAD] animate-spin" />
              </div>
            ) : (
              <EventCard event={events[current]} />
            )}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {events.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-[400ms] ease-in-out"
                style={{
                  width:           i === current ? 22 : 8,
                  backgroundColor: i === current ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Responsive overrides for smaller screens */}
      <style>{`
        @media (max-width: 768px) {
          .event-card-content { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

    </section>
  );
};

export default UpcomingEvents;