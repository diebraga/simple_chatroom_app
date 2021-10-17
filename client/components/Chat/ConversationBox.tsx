import { Box, Button, Flex, Input, Text, useToast, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Messages } from "../../types/chat";
import { ConversationBoxProps } from "../../types/props";

export default function ConversationBox({ socket, username, room, chatIsShowing }: ConversationBoxProps) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState<Messages[]>([])

  const messagesEndRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messageList]);

  const toast = useToast()

  async function sendMessage(e: FormEvent<HTMLFontElement | HTMLInputElement | HTMLDivElement>) {
    e.preventDefault()
    const add0 = new Date(Date.now()).getMinutes() < 10 ? '0' : ''
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      formated_time: new Date(Date.now()).getHours() + ":" + add0 + new Date(Date.now()).getMinutes()
    }

    if (currentMessage === '') return
    else {
      setCurrentMessage('')
      socket.emit('send_message', messageData)
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList(curr => [...curr, data])
    })
  }, [socket])

  useEffect(() => {
    socket.on('join_room', (data) => {
      toast({
        title: "Info.",
        description: data,
        status: "info",
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
    })
  }, [socket])


  return (
    <VStack as='form' onSubmit={sendMessage} display={!chatIsShowing ? 'none' : 'block'} mt='10px'>
      <Text fontSize='28px'>Live chat</Text>
      <ChatContainer>
        {messageList.map((message, index) => {
          const isUserEqualsToAuthor = username === message.author

          return (
            <Flex key={index} mr='2' ml='2' align='center' flexDir={isUserEqualsToAuthor ? 'row' : 'row-reverse'}>
              <Box pt='3'>
                <Flex bg={isUserEqualsToAuthor ? 'blue.400' : 'whatsapp.600'} border='1px' color='white' borderColor='gray.900' p='1' borderRadius='lg'>
                  <Text fontSize="sm">{message.message}</Text>
                </Flex>
                <Text as='span' fontSize='10px'><strong>{isUserEqualsToAuthor ? 'me' : message.author}</strong> {message.formated_time}</Text>
              </Box>
              <div ref={messagesEndRef} />

            </Flex>          
          )
        })}
      </ChatContainer>
      <Flex>
        <Input 
          onChange={e => setCurrentMessage(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
          value={currentMessage}
        />
        <Button type='submit'>Send</Button>
      </Flex>
    </VStack>
  )
}

const ChatContainer = styled(Box)`
  height: calc(450px - (45px + 70px));
  border: 1px solid #263238;
  background: #fff;

  position: relative;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`
