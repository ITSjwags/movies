import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'

const ErrorScreen = () => (
  <AnimatePresence
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Container>
      <motion.h1>Whoops!</motion.h1>
      <p>
        Looks like something went wrong. Let&apos;s try going{' '}
        <Link href="/">
          <a>Home</a>
        </Link>
        .
      </p>
    </Container>
  </AnimatePresence>
)

const Container = styled(motion.div)`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
`

export default ErrorScreen
