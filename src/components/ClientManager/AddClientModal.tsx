// src/components/ClientManager/AddClientModal.tsx

import { useState } from 'react'
import axios from 'axios'
import { ClientCardDto } from '../../constants/ClientCardDto'

type Props = {
  onClose: () => void
  onSave: (newClient: ClientCardDto) => void
}

export default function AddClientModal({ onClose, onSave }: Props) {
  const [client, setClient] = useState<Omit<ClientCardDto, 'clientId' | 'purchases'>>({
    lastName: '',
    firstName: '',
    middleName: '',
    phoneNumber: '',
    email: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await axios.post<ClientCardDto>(
        'https://localhost:7181/api/clients',
        client
      )
      onSave(res.data)
      onClose()
    } catch (err) {
      console.error('Не вдалося створити клієнта:', err)
      alert('Помилка при створенні клієнта')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Новий клієнт</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
            disabled={isSaving}
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="font-semibold">Прізвище</label>
            <input
              type="text"
              value={client.lastName}
              onChange={e => setClient(prev => ({ ...prev, lastName: e.target.value }))}
              className="border p-2 rounded w-full"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="font-semibold">Ім’я</label>
            <input
              type="text"
              value={client.firstName}
              onChange={e => setClient(prev => ({ ...prev, firstName: e.target.value }))}
              className="border p-2 rounded w-full"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="font-semibold">По батькові</label>
            <input
              type="text"
              value={client.middleName || ''}
              onChange={e => setClient(prev => ({ ...prev, middleName: e.target.value }))}
              className="border p-2 rounded w-full"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="font-semibold">Телефон</label>
            <input
              type="tel"
              value={client.phoneNumber}
              onChange={e => setClient(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="border p-2 rounded w-full"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              value={client.email}
              onChange={e => setClient(prev => ({ ...prev, email: e.target.value }))}
              className="border p-2 rounded w-full"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={isSaving}
          >
            Відмінити
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
            disabled={isSaving}
          >
            {isSaving ? 'Створення...' : 'Створити'}
          </button>
        </div>
      </div>
    </div>
  )
}
