import { useEffect, useRef, useCallback } from 'react'

type NotificationHandler = (msg: { type: string; message: string }) => void

export function useWebSocket(userId: number | null, onMessage: NotificationHandler) {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!userId) return

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:8000/ai/ws/${userId}`)
      wsRef.current = ws

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          onMessage(data)
        } catch {}
      }

      ws.onclose = () => {
        // Reconnect after 5 seconds
        setTimeout(connect, 5000)
      }

      ws.onerror = () => ws.close()
    }

    connect()

    // Keep-alive ping every 30s
    const ping = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping')
      }
    }, 30000)

    return () => {
      clearInterval(ping)
      wsRef.current?.close()
    }
  }, [userId])
}

export function useNotificationPermission() {
  const request = useCallback(async () => {
    if (!('Notification' in window)) return 'denied'
    if (Notification.permission === 'granted') return 'granted'
    return Notification.requestPermission()
  }, [])

  const show = useCallback((title: string, body: string, icon = '/icons/icon-192.png') => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon })
    }
  }, [])

  return { permission: Notification.permission, request, show }
}
