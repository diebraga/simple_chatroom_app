import Link from 'next/link'
import Layout from '../components/Layout'
import { io } from 'socket.io-client'
import { Heading } from '@chakra-ui/react'

const IndexPage = () => {
  const socket = io(`http://localhost:5000`)
  return (
    <Layout title="Home">
      <Heading>Hello world</Heading>
    </Layout>
  )
}

export default IndexPage
