import  { useState,useEffect } from 'react';
import heroImg from './assets/hero.png';
import Search from './Search';
import LoadingSpinner from './components/spinner'
import MovieCards from './components/MovieCards';
import { useDebounce } from 'react-use';


const API_BASE_URL ='https://api.themoviedb.org/3/';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {

  const [searchTerm, setsearchTerm] = useState('');

  const [errorMessage, seterrorMessage] = useState('');
  const [MovieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
    
  useDebounce(
  () => {
    if (searchTerm.trim()) {
      fetchMovies(searchTerm);
    }
  },
  1000,
  [searchTerm]
);


  const fetchMovies = async (query = '') => {
    setisLoading(true);
    seterrorMessage('');
    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by-popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error("Failed To Fetch Movies..")
      }

      const data = await response.json();

      if(data.Response === 'false'){
        seterrorMessage(data.Error || "Failed to Movies...")
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    }catch(error){
      console.log(`Error Fetching Movie.... ${error}`);
      seterrorMessage('Error while Fetching Movies... Please Try again Later....')
      
    }
    finally{
      setisLoading(false)
    }
  }


  useEffect(() => {
  fetchMovies(); // loads popular movies on first render
}, []);

  return (
    <main>
      <div className="bg-[url('/images/hero-bg.png')] bg-cover bg-center min-h-screen">
        <div className='pattern' />
        <div className='wrapper'>
          <header>
            <img src={heroImg} alt="Hero Banner" /> 
            <h1>
              Find <span className='text-gradient'>Movies</span> That You'll Enjoy Without Hassle
            </h1>
            <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
          </header>
          <section className="all-movies">
            <h2 className='text-left mt-[40px]'>All Movies</h2>
          


            {isLoading ? (
              <LoadingSpinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {MovieList.map((movie) => (
                  <MovieCards key={movie.id} movie={movie}/>
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
