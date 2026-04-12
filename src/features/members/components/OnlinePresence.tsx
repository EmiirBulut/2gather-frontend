import { useEffect, useState } from 'react'
import { getConnection } from '@/services/signalR'
import * as signalR from '@microsoft/signalr'
import styles from './OnlinePresence.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnlineMember {
  userId: string
  displayName: string
}

interface Props {
  listId: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// ─── Component ────────────────────────────────────────────────────────────────

const OnlinePresence = ({ listId }: Props) => {
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([])

  useEffect(() => {
    const connection = getConnection()
    if (!connection) return

    // Receive current presence list when joining
    const handlePresenceList = (members: OnlineMember[]) => {
      setOnlineMembers(members)
    }

    // A new member came online in this list
    const handleMemberOnline = (member: OnlineMember) => {
      setOnlineMembers((prev) => {
        const exists = prev.some((m) => m.userId === member.userId)
        return exists ? prev : [...prev, member]
      })
    }

    // A member went offline / left
    const handleMemberOffline = (userId: string) => {
      setOnlineMembers((prev) => prev.filter((m) => m.userId !== userId))
    }

    connection.on('PresenceList', handlePresenceList)
    connection.on('MemberOnline', handleMemberOnline)
    connection.on('MemberOffline', handleMemberOffline)

    // Request presence list for this list if hub supports it
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.invoke('GetPresence', listId).catch(() => {
        // Hub may not support this yet — silent fail
      })
    }

    return () => {
      connection.off('PresenceList', handlePresenceList)
      connection.off('MemberOnline', handleMemberOnline)
      connection.off('MemberOffline', handleMemberOffline)
    }
  }, [listId])

  if (onlineMembers.length === 0) return null

  const visible = onlineMembers.slice(0, 4)
  const overflow = onlineMembers.length - visible.length

  return (
    <div className={styles.presence} aria-label={`${onlineMembers.length} kişi çevrimiçi`}>
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.avatars}>
        {visible.map((member) => (
          <div
            key={member.userId}
            className={styles.avatar}
            title={member.displayName}
            aria-label={member.displayName}
          >
            {initials(member.displayName)}
          </div>
        ))}
        {overflow > 0 && (
          <div className={`${styles.avatar} ${styles.overflow}`}>
            +{overflow}
          </div>
        )}
      </div>
      <span className={styles.label}>
        {onlineMembers.length === 1 ? '1 çevrimiçi' : `${onlineMembers.length} çevrimiçi`}
      </span>
    </div>
  )
}

export default OnlinePresence
