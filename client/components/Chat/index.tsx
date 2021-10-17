import { io } from 'socket.io-client'
import { Button, Center, Heading, Input, Select, VStack } from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import ConversationBox from './ConversationBox'
import { roomOptions } from '../../utils/consts'

export default function Chat() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [chatIsShowing, setChatIsShowing] = useState(false)

  const socket = io(`http://localhost:5500`)

  const joinRoom = (e: FormEvent<HTMLFontElement | HTMLDivElement>) => {
    e.preventDefault()
    const data = {
      room,
      username
    }
    if (username !== '' && room !== '') {
      socket.emit('join_room', data)
      setChatIsShowing(true)
    }
    else return 
  }

  return (
    <Center mt='80px'>
      <VStack as='form' onSubmit={joinRoom} w='500px' justify='center' display={chatIsShowing ? 'none' : 'block'}>
        <Heading>Join chat</Heading>
        <Input type='text' placeholder='Your name' onChange={e => setUsername(e.target.value)}/>
        <Select placeholder="Select room" onChange={e => setRoom(e.currentTarget.value)}>
          {roomOptions.map((item, index) => {
            return (
              <option value={item.value} key={index}>{item.value}</option>
            )
          })}
        </Select>
        <Button type='submit'>Enter</Button>
      </VStack>
      <ConversationBox socket={socket} username={username} room={room} chatIsShowing={chatIsShowing}/>
    </Center>
  )
}
