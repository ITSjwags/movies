import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import useSwr from 'swr'

import ErrorScreen from '../../components/error-screen'
import Loader from '../../components/loader'
import { fetcher } from '../../utils'

const Movie = () => {
  const router = useRouter()
  const { movieId } = router.query
  const { data, error } = useSwr(
    movieId ? `/api/movies/${movieId}` : null,
    fetcher
  )

  if (error) return <ErrorScreen />
  if (!data) return <Loader item="movie" />

  const { credits, similar } = data
  const releaseDate = new Date(data?.release_date)
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const containerAnimations = {
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

  const childAnimations = {
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
      <Header
        key="header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h1>
          <BackArrow onClick={() => router.back()}>&larr;</BackArrow>
        </h1>

        <Title>
          {data?.homepage ? (
            <a href={data?.homepage} target="_blank" rel="noreferrer noopener">
              {data?.title}
            </a>
          ) : (
            data?.title
          )}
          {data?.tagline && <Tagline>{data?.tagline}</Tagline>}
        </Title>

        <div />
      </Header>

      <motion.div
        key="container"
        variants={containerAnimations}
        initial="initial"
        animate="show"
      >
        <Top>
          <Poster
            src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
            alt={data?.title}
            variants={childAnimations}
          />

          <Information variants={childAnimations}>
            <h2>Details</h2>

            <p>
              <b>Release Date:</b>{' '}
              {releaseDate.toLocaleDateString(undefined, options)}
            </p>

            <p>
              <b>Starring: </b>
              {credits?.cast
                // .filter((castData) => castData.cast_id < 10)
                .slice(0, 5)
                .map((filteredCast, index) => {
                  const { cast_id: id, name } = filteredCast
                  return <span key={id}>{(index ? ', ' : '') + name}</span>
                })}
            </p>

            <h2>Overview</h2>
            <p>{data?.overview}</p>
          </Information>
        </Top>
        {similar?.results?.length > 0 && (
          <>
            <Title>Similar Movies</Title>
            <SimilarList>
              {similar?.results.slice(0, 4).map((movie) => {
                const { backdrop_path: backdropPath, title, id } = movie

                return (
                  <motion.li key={id} variants={childAnimations}>
                    <Link href="/movie/[movieId]" as={`/movie/${id}`} passHref>
                      <SimilarMovie>
                        <Backdrop
                          src={`https://image.tmdb.org/t/p/w1280${backdropPath}`}
                          alt={title}
                        />
                        <Details>
                          <h2>{title}</h2>
                        </Details>
                      </SimilarMovie>
                    </Link>
                  </motion.li>
                )
              })}
            </SimilarList>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

const Header = styled(motion.header)`
  display: grid;
  grid-template-columns: 1fr 6fr 1fr;
  place-items: center;
`

const Title = styled(motion.h1)`
  text-align: center;
`

const BackArrow = styled(motion.button)`
  background: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  outline: none;
  padding: 0;
  text-decoration: none;
  transition: transform 500ms ease;

  &:hover {
    transform: translateX(-10px);
  }
`

const Top = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  max-width: 960px;

  @media screen and (min-width: 960px) {
    grid-gap: 40px;
    grid-template-columns: 1.5fr 2fr;
    padding: 50px 0;
  }
`

const Tagline = styled.span`
  display: block;
  font-size: 0.5em;
  font-weight: normal;
  margin-top: 0.5em;
`

const Poster = styled(motion.img)`
  display: block;
  margin: 0 auto 20px;
  max-width: 100%;
`

const Information = styled(motion.div)`
  padding: 0 20px;
`

const SimilarList = styled(motion.ul)`
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;

  @media screen and (min-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
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

const SimilarMovie = styled(motion.a)`
  cursor: pointer;
  display: grid;
  place-items: center;
  overflow: hidden;
  min-height: 40vh;
  position: relative;

  &:hover > ${Backdrop} {
    transform: scale(1.04);
  }

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

const Details = styled.div`
  position: relative;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  z-index: 1;
`

export default Movie
