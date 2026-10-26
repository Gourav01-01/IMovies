import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/movies/MovieCard';
import MovieFilterBar from '../components/movies/MovieFilterBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Film, ChevronLeft, ChevronRight } from 'lucide-react';

const MoviesPage = ({ selectedCity = 'All' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch filter dropdown options once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await movieApi.getFilters();
        if (res.genres) setAvailableGenres(res.genres);
        if (res.languages) setAvailableLanguages(res.languages);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch movies when filters change
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          city: selectedCity,
          sort,
        };
        if (search) params.search = search;
        if (status) params.status = status;
        if (genre) params.genre = genre;
        if (language) params.language = language;

        const res = await movieApi.getMovies(params);
        setMovies(res.movies || []);
        setTotalPages(res.totalPages || 1);
        setTotalMovies(res.total || 0);

        // Sync with URL query params
        const newParams = {};
        if (search) newParams.search = search;
        if (status) newParams.status = status;
        if (genre) newParams.genre = genre;
        if (language) newParams.language = language;
        if (sort !== 'rating') newParams.sort = sort;
        if (page > 1) newParams.page = page;
        setSearchParams(newParams, { replace: true });
      } catch (err) {
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, status, genre, language, sort, page, selectedCity]);

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setGenre('');
    setLanguage('');
    setSort('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.4rem',
          }}
        >
          Explore Cinema Catalog
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Discover the latest releases, browse by genre, and book your tickets instantly.
        </p>
      </div>

      {/* Filter Bar */}
      <MovieFilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        genre={genre}
        onGenreChange={(val) => { setGenre(val); setPage(1); }}
        language={language}
        onLanguageChange={(val) => { setLanguage(val); setPage(1); }}
        sort={sort}
        onSortChange={(val) => { setSort(val); setPage(1); }}
        availableGenres={availableGenres}
        availableLanguages={availableLanguages}
        onReset={handleReset}
      />

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          color: '#94a3b8',
          fontSize: '0.88rem',
        }}
      >
        <span>
          Showing <strong style={{ color: '#fff' }}>{movies.length}</strong> of{' '}
          <strong style={{ color: '#fff' }}>{totalMovies}</strong> movies
        </span>
        {selectedCity !== 'All' && (
          <span className="badge badge-amber">Filtered by {selectedCity}</span>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner text="Searching cinema archives..." />
      ) : movies.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Film size={48} color="#64748b" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#fff' }}>
            No movies match your criteria
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: '400px', fontSize: '0.9rem' }}>
            Try adjusting your search terms, changing the genre or location, or reset the filters.
          </p>
          <button onClick={handleReset} className="btn-secondary" style={{ marginTop: '0.5rem' }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="movie-grid" style={{ marginBottom: '3rem' }}>
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: page === pageNum ? '#fff' : '#94a3b8',
                    backgroundColor: page === pageNum ? '#e50914' : 'rgba(255, 255, 255, 0.05)',
                    border: page === pageNum ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 150ms',
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
