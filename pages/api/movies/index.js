import axios from 'axios'

export default async function handler(req, res) {
  const { page } = req.query
  // initial request gets page 1
  // set up to allow more pages upon request
  const movies = await axios
    .get(
      `https://api.themoviedb.org/3/movie/popular?api_key=b8596e31110ca11ebdd806b0354bba7f&language=en-US&page=${
        page || 1
      }`
    )
    .then((response) => response.data)

  res.status(200).json(movies)
}
