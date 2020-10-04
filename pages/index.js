import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import useSwr from 'swr'

import ErrorScreen from '../components/error-screen'
import Loader from '../components/loader'
import { debounce, fetcher } from '../utils'

const Home = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [focused, setFocused] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce((q) => setSearchTerm(q), 250),
    []
  )
  const { data: movies, error } = useSwr('/api/movies', fetcher)
  const { data: searchResults } = useSwr(
    searchTerm ? `/api/movies/search?term=${searchTerm}` : null,
    fetcher
  )

  const handleSearch = (event) => {
    const { value } = event.target
    setLocalSearchTerm(value)
    delayedSearch(value)
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  if (error) return <ErrorScreen />
  if (!movies) return <Loader item="movies" />

  const { results: popularMovies } = movies || {}
  const { results: searchedForMovies } = searchResults || {}

  const moviesToShow = searchTerm ? searchedForMovies : popularMovies

  const movieListAnimations = {
    initial: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.5,
        delayChildren: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const movieAnimations = {
    initial: {
      y: -25,
      opacity: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  }

  return (
    <AnimatePresence>
      <Top>
        <Title
          key="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.25 }}
        >
          Movies
          <Tagline>
            {moviesToShow
              ? `(showing ${moviesToShow?.length} ${
                  searchedForMovies ? ' movies' : ' most popular'
                })`
              : 'searching...'}
          </Tagline>
        </Title>
        <SearchContainer focused={localSearchTerm || focused}>
          <Search
            type="text"
            value={localSearchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </SearchContainer>
      </Top>

      <MovieList
        key="movies"
        variants={movieListAnimations}
        initial="initial"
        animate="show"
      >
        {!moviesToShow ? (
          <SearchingText>Searching for movies...</SearchingText>
        ) : (
          moviesToShow
            .sort((a, b) => parseFloat(b.popularity) - parseFloat(a.popularity))
            .map((movie) => {
              const { backdrop_path: backdropPath, title, id } = movie

              return (
                <motion.li key={id} variants={movieAnimations}>
                  <Link href="/movie/[movieId]" as={`/movie/${id}`} passHref>
                    <Movie background={!!backdropPath}>
                      {backdropPath && (
                        <Backdrop
                          src={`https://image.tmdb.org/t/p/w1280${backdropPath}`}
                          alt={title}
                        />
                      )}
                      <Details>
                        <h2>{title}</h2>
                      </Details>
                    </Movie>
                  </Link>
                </motion.li>
              )
            })
        )}
      </MovieList>
    </AnimatePresence>
  )
}

const Top = styled(motion.div)`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  padding: 0 20px;

  @media screen and (min-width: 960px) {
    grid-gap: 40px;
    grid-template-columns: 1fr auto;
  }
`

const Title = styled(motion.h1)`
  text-align: center;

  @media screen and (min-width: 960px) {
    text-align: left;
  }
`

const Tagline = styled.span`
  display: block;
  font-size: 0.5em;
  font-weight: normal;
  margin-top: 0.5em;
`

const Search = styled.input`
  background: transparent;
  border: none;
  box-sizing: border-box;
  height: 50px;
  padding: 10px;
  position: relative;
  width: 100%;

  @media screen and (min-width: 960px) {
    width: 400px;
  }
`

const SearchContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.grayLight};
  margin-top: 20px;

  &:after {
    content: 'Search for a movie';
    font-size: ${({ focused }) => (focused ? '14px' : '16px')};
    font-weight: normal;
    left: 20px;
    letter-spacing: 1px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: ${({ focused }) =>
      focused ? 'translateY(-50px) translateX(-20px);' : 'translateY(-50%);'};
    transition: transform 250ms ease, font-size 300ms ease;
    width: 95%;
    z-index: 100;
  }

  @media screen and (min-width: 960px) {
    margin-top: 0;
    width: 400px;
  }
`

const MovieList = styled(motion.ul)`
  display: grid;
  grid-template-columns: 1fr;
  margin: 20px 0 0 0;
  padding: 0;

  @media screen and (min-width: 1920px) {
    grid-template-columns: 1fr 1fr;
  }
`

const SearchingText = styled.p`
  padding: 0 20px;
`

const Backdrop = styled.img`
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  top: 0;
  transition: transform 500ms ease;
  transform: scale(1.01);
  width: 100%;
`

const Movie = styled(motion.a)`
  cursor: pointer;
  display: grid;
  place-items: center;
  overflow: hidden;
  min-height: 40vh;
  position: relative;

  &:hover > ${Backdrop} {
    transform: scale(1.04);
  }

  ${({ background, theme }) =>
    background
      ? css`
          &::after {
            background: rgba(0, 0, 0, 0.6);
            content: '';
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }
        `
      : css`
          background: ${theme.colors.gray};
        `}
`

const Details = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  z-index: 1;
`

export default Home
