export type JoinRoomEvent = {
  username: string,
  room: string
}

export type ReceiveMessageEvent = {
  room: string
  author: string
  message: string
  formated_time: string
}