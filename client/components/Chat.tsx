import { Button, Center, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type ChatProps = {
  socket: Socket
  username: string
  room: string
}

export default function Chat({ socket, username, room }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState('')

  async function sendMessage(e: FormEvent<HTMLFontElement>) {
    e.preventDefault()
    const add0 = new Date(Date.now()).getMinutes() < 10 ? '0' : ''
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      formated_time: new Date(Date.now()).getHours() + ":" + add0 + new Date(Date.now()).getMinutes()
    }

    if (currentMessage === '') return
    else socket.emit('send_message', messageData)
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data)
    })
  }, [socket])
  return (
    // @ts-ignore
    <VStack as='form' onSubmit={sendMessage}>
      <Text>Live chat</Text>
      <Flex>
        <Input onChange={e => setCurrentMessage(e.target.value)} />
        <Button type='submit'>Send</Button>
      </Flex>
    </VStack>
  )
}
