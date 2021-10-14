import { Socket } from "socket.io-client";

export type ConversationBoxProps = {
  socket: Socket
  username: string
  room: string
  chatIsShowing: boolean
}
