import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const MovieFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  genre,
  onGenreChange,
  language,
  onLanguageChange,
  sort,
  onSortChange,
  availableGenres = [],
  availableLanguages = [],
  onReset,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Top Row: Search and Status Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Status Filter Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '0.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {[
            { id: '', label: 'All Releases' },
            { id: 'now_showing', label: 'Now Showing' },
            { id: 'coming_soon', label: 'Coming Soon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: status === tab.id ? '#ffffff' : '#94a3b8',
                backgroundColor: status === tab.id ? '#e50914' : 'transparent',
                transition: 'all 150ms',
                boxShadow: status === tab.id ? '0 2px 10px rgba(229, 9, 20, 0.4)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 240px' }}>
          <Search
            size={16}
            color="#64748b"
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, cast..."
            className="form-input"
            style={{
              paddingLeft: '2.4rem',
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              fontSize: '0.88rem',
            }}
          />
        </div>
      </div>

      {/* Bottom Row: Genre, Language, Sort, Reset */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
          <Filter size={15} color="#e50914" />
          <span>Filters:</span>
        </div>

        {/* Genre Selector */}
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="form-select"
          style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          <option value="">All Genres</option>
          {availableGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="form-select"
          style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          <option value="">All Languages</option>
          {availableLanguages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="form-select"
          style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          <option value="rating">Top Rated First</option>
          <option value="release_date">Newest Release</option>
          <option value="title_asc">Title (A - Z)</option>
        </select>

        {/* Reset Button */}
        {(search || status || genre || language || sort !== 'rating') && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#94a3b8',
              fontSize: '0.82rem',
              marginLeft: 'auto',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <RotateCcw size={13} />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieFilterBar;
