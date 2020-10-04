import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Loader = (props) => {
  const { item } = props

  return (
    <AnimatePresence
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <motion.h1>{`Loading ${item}...`}</motion.h1>
      </Container>
    </AnimatePresence>
  )
}

const Container = styled(motion.div)`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`

Loader.propTypes = {
  item: PropTypes.string.isRequired,
}

export default Loader
