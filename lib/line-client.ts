import { Client, middleware, ClientConfig, MiddlewareConfig } from '@line/bot-sdk'

let lineClientInstance: Client | null = null
let lineMiddlewareInstance: ReturnType<typeof middleware> | null = null

function getLineClient(): Client {
  if (!lineClientInstance) {
    // Only check at runtime, not at build time
    // During build, these may not be set, which is OK
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
    const channelSecret = process.env.LINE_CHANNEL_SECRET

    if (!channelAccessToken || !channelSecret) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET must be set')
    }

    const clientConfig: ClientConfig = {
      channelAccessToken,
      channelSecret,
    }

    lineClientInstance = new Client(clientConfig)
  }
  return lineClientInstance
}

function getLineMiddleware() {
  if (!lineMiddlewareInstance) {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
    const channelSecret = process.env.LINE_CHANNEL_SECRET

    if (!channelAccessToken || !channelSecret) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET must be set')
    }

    const middlewareConfig: MiddlewareConfig = {
      channelAccessToken,
      channelSecret,
    }

    lineMiddlewareInstance = middleware(middlewareConfig)
  }
  return lineMiddlewareInstance
}

// Create a proxy that lazily initializes the client only when accessed
const lineClientProxy = new Proxy({} as Client, {
  get(_target, prop) {
    const client = getLineClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
}) as Client

const lineMiddlewareProxy = new Proxy({} as ReturnType<typeof middleware>, {
  get(_target, prop) {
    const middlewareInstance = getLineMiddleware()
    const value = (middlewareInstance as any)[prop]
    if (typeof value === 'function') {
      return value.bind(middlewareInstance)
    }
    return value
  },
}) as ReturnType<typeof middleware>

export const lineClient = lineClientProxy
export const lineMiddleware = lineMiddlewareProxy
