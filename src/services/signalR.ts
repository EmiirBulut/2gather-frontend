import * as signalR from '@microsoft/signalr'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCallback<T = unknown> = (payload: T) => void

// ─── State ────────────────────────────────────────────────────────────────────

let connection: signalR.HubConnection | null = null
let startPromise: Promise<void> | null = null
// The list whose group we should be in. Group membership is lost on every
// (re)connect, so it is re-joined whenever the connection comes up.
let desiredListId: string | null = null

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

async function joinDesiredList(): Promise<void> {
  if (desiredListId && connection?.state === signalR.HubConnectionState.Connected) {
    await connection.invoke('JoinList', desiredListId)
  }
}

export async function connect(): Promise<void> {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    return startPromise ?? undefined
  }
  connection = buildConnection()
  connection.onreconnected(() => {
    joinDesiredList().catch(() => {
      // Rejoin failure is non-fatal; the next reconnect or list change retries
    })
  })
  startPromise = connection.start().then(joinDesiredList)
  await startPromise
}

export async function disconnect(): Promise<void> {
  desiredListId = null
  startPromise = null
  // Release the reference before stopping so an immediate connect() (e.g. React
  // StrictMode re-running effects) builds a fresh connection instead of reusing this one
  const closing = connection
  connection = null
  if (closing) await closing.stop()
}

/** Joins now if connected; otherwise the join happens as soon as the connection starts. */
export async function joinList(listId: string): Promise<void> {
  desiredListId = listId
  await joinDesiredList()
}

export async function leaveList(listId: string): Promise<void> {
  if (desiredListId === listId) desiredListId = null
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
