import { Client, middleware, MiddlewareConfig } from '@line/bot-sdk'

const config: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
}

export const lineClient = new Client(config)
export const lineMiddleware = middleware(config)
