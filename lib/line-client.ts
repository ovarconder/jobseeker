import { Client, middleware, ClientConfig, MiddlewareConfig } from '@line/bot-sdk'

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
const channelSecret = process.env.LINE_CHANNEL_SECRET

if (!channelAccessToken || !channelSecret) {
  throw new Error('LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET must be set')
}

const clientConfig: ClientConfig = {
  channelAccessToken,
  channelSecret,
}

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken,
  channelSecret,
}

export const lineClient = new Client(clientConfig)
export const lineMiddleware = middleware(middlewareConfig)
