import axios from 'axios'

export default async function handler(req, res) {
  const {
    query: { movieId },
  } = req

  // append_to_response is used to add extra data that might have needed another api call
  const movie = await axios
    .get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=b8596e31110ca11ebdd806b0354bba7f&language=en-US&append_to_response=credits,similar`
    )
    .then((response) => response.data)

  res.status(200).json(movie)
}
