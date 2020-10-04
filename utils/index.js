import axios from 'axios'

export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const debounce = (callback, wait) => {
  let timeout = null
  return (...args) => {
    const next = () => callback(...args)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
  }
}

export const fetcher = async (url) =>
  axios
    .get(url)
    .then(await delay(1000)) // quick hack to fake loading for UX purposes
    .then((res) => res.data)
