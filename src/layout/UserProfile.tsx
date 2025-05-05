// src/layout/UserProfile.tsx
import React from 'react'
import { useAuth } from '../components/AuthContext'

type Props = {
  username: string
  role: string
}

// Вбудований SVG-аватар як data URI
const USER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975
       m11.963 0a9 9 0 1 0-11.963 0
       m11.963 0A8.966 8.966 0 0 1 12 21
       a8.966 8.966 0 0 1-5.982-2.275
       M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`.trim()

export const getAvatarByRole = (_role: string): string => {
  // повертаємо data URI для <img src=...>
  return `data:image/svg+xml;utf8,${encodeURIComponent(USER_SVG)}`
}

export default function UserProfile({ username, role }: Props) {
  const { logout } = useAuth()
  const avatarSrc = getAvatarByRole(role)

  return (
    <div className="flex items-center gap-3 mt-4 pt-4 border-t">
      <img
        src={avatarSrc}
        alt={username}
        className="w-9 h-9 rounded-full object-cover text-gray-400"
      />
      <div className="text-sm leading-tight">
        <div className="font-semibold">{username}</div>
        <div className="text-gray-500">{role}</div>
      </div>
      <button
        onClick={logout}
        className="text-xs text-red-500 hover:underline ml-auto cursor-pointer"
      >
        Вийти
      </button>
    </div>
  )
}
