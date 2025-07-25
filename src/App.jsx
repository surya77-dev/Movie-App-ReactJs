import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import heroImg from './assets/hero.png';
import Search from './Search';
import LoadingSpinner from './components/spinner';
import MovieCards from './components/MovieCards';

// API Config
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [MovieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  // Debounced search
  useDebounce(
    () => {
      if (searchTerm.trim()) {
        fetchMovies(searchTerm);
      } else {
        fetchMovies(); // Revert to popular movies when input is cleared
      }
    },
    1000,
    [searchTerm]
  );

  // Fetch Movies Function
  const fetchMovies = async (query = '') => {
    setisLoading(true);
    seterrorMessage('');

    try {
      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
        : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies.');
      }

      const data = await response.json();

      if (data?.results?.length === 0) {
        seterrorMessage('No movies found.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      seterrorMessage('Error while fetching movies. Please try again later.');
    } finally {
      setisLoading(false);
    }
  };

  // Initial fetch for popular movies
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="bg-[url('/images/hero-bg.png')] bg-cover bg-center min-h-screen">
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src={heroImg} alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> That You'll Enjoy Without Hassle
            </h1>
            <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className="text-left mt-[40px]">All Movies</h2>

            {isLoading ? (
              <LoadingSpinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {MovieList.map((movie) => (
                  <MovieCards key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
