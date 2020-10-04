import PropTypes from 'prop-types'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'styled-normalize'

const theme = {
  colors: {
    white: 'white',
    black: 'black',
    gray: 'gray',
    grayLight: 'lightgray',
  },
}

const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    background: ${theme.colors.white};
    color: ${theme.colors.black};
    font-family: 'Merriweather', serif;
    font-size: clamp(100%, 1rem + 2vw, 18px);
    line-height: 1.5;
  }

  h1, h2, h3 {
    font-family: 'Lora', serif;
    font-size: clamp(100%, 1rem + 2vw, 64px);
    line-height: 1.25;
  }

  a {
    color: ${theme.colors.black};
  }

  input {
    font-family: 'Merriweather', serif;
  }
`

const App = (props) => {
  const { Component, pageProps } = props

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.any.isRequired,
}

export default App
