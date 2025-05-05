// src/components/ClientManager/ClientList.tsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import { ClientCardDto } from '../../constants/ClientCardDto'
import ClientHeader from './ClientHeader'
import ClientCard from './ClientCard'
import AddClientModal from './AddClientModal'

const ITEMS_PER_PAGE = 15

// Заново оголошуємо тип сортування, щоб не тягнути його з ClientHeader
type SortField =
  | 'lastName'
  | 'firstName'
  | 'phoneNumber'
  | 'purchasesCount'
  | 'lastPurchaseNumber'
  | 'lastPurchaseDate'
  | 'lastPurchaseStatus'

export default function ClientList() {
  const [clients, setClients] = useState<ClientCardDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('lastName')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Завантажуємо клієнтів з бекенду при зміні пошуку
  useEffect(() => {
    axios
      .get<ClientCardDto[]>('https://localhost:7181/api/clients', {
        params: { searchTerm }
      })
      .then(res => {
        setClients(res.data)
        setCurrentPage(1)
      })
      .catch(console.error)
  }, [searchTerm])

  // Сортування
  const sorted = [...clients].sort((a, b) => {
    let aV: string | number = ''
    let bV: string | number = ''

    switch (sortField) {
      case 'lastName':
        aV = a.lastName
        bV = b.lastName
        break
      case 'firstName':
        aV = a.firstName
        bV = b.firstName
        break
      case 'phoneNumber':
        aV = a.phoneNumber
        bV = b.phoneNumber
        break
      case 'purchasesCount':
        aV = a.purchases.length
        bV = b.purchases.length
        break
      case 'lastPurchaseNumber':
        aV = a.purchases.length
          ? a.purchases[a.purchases.length - 1].purchaseNumber
          : ''
        bV = b.purchases.length
          ? b.purchases[b.purchases.length - 1].purchaseNumber
          : ''
        break
      case 'lastPurchaseDate':
        aV = a.purchases.length
          ? new Date(a.purchases[a.purchases.length - 1].purchaseDate).getTime()
          : 0
        bV = b.purchases.length
          ? new Date(b.purchases[b.purchases.length - 1].purchaseDate).getTime()
          : 0
        break
      case 'lastPurchaseStatus':
        aV = a.purchases.length
          ? a.purchases[a.purchases.length - 1].status
          : ''
        bV = b.purchases.length
          ? b.purchases[b.purchases.length - 1].status
          : ''
        break
    }

    if (typeof aV === 'string' && typeof bV === 'string') {
      return sortOrder === 'asc'
        ? aV.localeCompare(bV)
        : bV.localeCompare(aV)
    } else {
      return sortOrder === 'asc'
        ? (aV as number) - (bV as number)
        : (bV as number) - (aV as number)
    }
  })

  // Пагінація
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const visible = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className={`flex flex-col gap-6 ${isFilterOpen ? 'w-[75%]' : 'w-[100%]'}`}>
      {/* Хедер: пошук, сортування, фільтри, кнопка додати */}
      <ClientHeader
        total={clients.length}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setClients={setClients}
        onAdd={() => setIsAddOpen(true)}
      />

      {/* Модалка створення нового клієнта */}
      {isAddOpen && (
        <AddClientModal
          onClose={() => setIsAddOpen(false)}
          onSave={newClient => {
            setClients(prev => [newClient, ...prev])
            setIsAddOpen(false)
          }}
        />
      )}

      {/* Сітка карток клієнтів */}
      <div
        className={`grid gap-4 grid-cols-1 md:grid-cols-2 ${
          isFilterOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-3'
        }`}
      >
        {visible.map(client => (
          <ClientCard key={client.clientId} client={client} />
        ))}
      </div>

      {/* Пагінація */}
      <div className="flex justify-center mt-6 gap-2 items-center flex-wrap">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 rounded text-sm ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400'
              : 'bg-white border hover:bg-gray-100 text-gray-700'
          }`}
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`w-8 h-8 rounded text-sm ${
              currentPage === idx + 1
                ? 'bg-primary text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-100'
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 rounded text-sm ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400'
              : 'bg-white border hover:bg-gray-100 text-gray-700'
          }`}
        >
          ›
        </button>
      </div>
    </div>
  )
}
