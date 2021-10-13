import Layout from '../components/Layout'
import { io } from 'socket.io-client'
import { Button, Center, Heading, Input, VStack } from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import Chat from '../components/Chat'

const IndexPage = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  const socket = io(`http://localhost:5700`)

  const joinRoom = (e: FormEvent<HTMLFontElement>) => {
    e.preventDefault()
    const data = {
      room,
      username
    }
    if (username !== '' && room !== '') socket.emit('join_room', data)
    else return 
  }

  return (
    <Layout title="Home">
      <Center>
        {/* @ts-ignore */}
        <VStack as='form' onSubmit={joinRoom} bg='black' w='500px' justify='center'>
          <Heading>Join chat</Heading>
          <Input type='text' placeholder='Your name' onChange={e => setUsername(e.target.value)}/>
          <Input type='text' placeholder='Your room' onChange={e => setRoom(e.target.value)}/>
          <Button type='submit'>Enter</Button>

        </VStack>
        <Chat socket={socket} username={username} room={room}/>
      </Center>
    </Layout>
  )
}

export default IndexPage
