import axios from 'axios'

export default async function handler(req, res) {
  const { term } = req.query
  const movies = await axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=b8596e31110ca11ebdd806b0354bba7f&language=en-US&query=${term}&page=1&include_adult=false`
    )
    .then((response) => response.data)

  res.status(200).json(movies)
}
