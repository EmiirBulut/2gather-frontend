import * as signalR from '@microsoft/signalr'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCallback<T = unknown> = (payload: T) => void

// ─── State ────────────────────────────────────────────────────────────────────

let connection: signalR.HubConnection | null = null

// ─── Token accessor ───────────────────────────────────────────────────────────
// Reads token lazily so it is always fresh (handles token refresh).

function getAccessToken(): string {
  try {
    const raw = sessionStorage.getItem('auth-storage')
    if (!raw) return ''
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
    return parsed?.state?.accessToken ?? ''
  } catch {
    return ''
  }
}

// ─── Build connection ─────────────────────────────────────────────────────────

function buildConnection(): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl('/hubs/list', {
      accessTokenFactory: getAccessToken,
    })
    .withAutomaticReconnect([0, 2000, 5000])
    .configureLogging(signalR.LogLevel.Warning)
    .build()
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function connect(): Promise<void> {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    return
  }
  connection = buildConnection()
  await connection.start()
}

export async function disconnect(): Promise<void> {
  if (connection) {
    await connection.stop()
    connection = null
  }
}

export async function joinList(listId: string): Promise<void> {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    await connection.invoke('JoinList', listId)
  }
}

export async function leaveList(listId: string): Promise<void> {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    await connection.invoke('LeaveList', listId)
  }
}

export function onEvent<T = unknown>(event: string, callback: EventCallback<T>): () => void {
  if (!connection) return () => {}
  connection.on(event, callback)
  return () => connection?.off(event, callback)
}

export function getConnection(): signalR.HubConnection | null {
  return connection
}
