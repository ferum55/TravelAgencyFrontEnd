// src/components/ClientManager/ClientHeader.tsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ClientCardDto } from '../../constants/ClientCardDto'

type SortField =
  | 'lastName'
  | 'firstName'
  | 'phoneNumber'
  | 'purchasesCount'
  | 'lastPurchaseNumber'
  | 'lastPurchaseDate'
  | 'lastPurchaseStatus'

interface PurchaseStatus {
  statusId: number
  statusName: string
}

type Props = {
  total: number
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  setClients: (clients: ClientCardDto[]) => void
  onAdd: () => void
}

export default function ClientHeader({
  total,
  isFilterOpen,
  setIsFilterOpen,
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setClients,
  onAdd
}: Props) {
  const [statuses, setStatuses] = useState<PurchaseStatus[]>([])
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const [purchasesCountFrom, setPurchasesCountFrom] = useState<number | ''>('')
  const [purchasesCountTo, setPurchasesCountTo]     = useState<number | ''>('')
  const [totalSpentFrom, setTotalSpentFrom]         = useState<number | ''>('')
  const [totalSpentTo, setTotalSpentTo]             = useState<number | ''>('')

  const [filterFirstName, setFilterFirstName] = useState('')
const [filterLastName, setFilterLastName] = useState('')
const [filterEmail, setFilterEmail] = useState('')
const [filterPhoneNumber, setFilterPhoneNumber] = useState('')

  useEffect(() => {
    axios
      .get<PurchaseStatus[]>('https://localhost:7181/api/clients/purchase-statuses')
      .then(res => setStatuses(res.data))
      .catch(console.error)
  }, [])

  const applyFilters = async () => {
    const params: any = { searchTerm }
    if (filterStatus)             params.status              = filterStatus
    if (filterDateFrom)           params.dateFrom            = filterDateFrom
    if (filterDateTo)             params.dateTo              = filterDateTo
    if (purchasesCountFrom !== '') params.purchasesCountFrom = purchasesCountFrom
    if (purchasesCountTo   !== '') params.purchasesCountTo   = purchasesCountTo
    if (totalSpentFrom    !== '') params.totalSpentFrom    = totalSpentFrom
    if (totalSpentTo      !== '') params.totalSpentTo      = totalSpentTo
    if (filterFirstName) params.firstName = filterFirstName
if (filterLastName)  params.lastName = filterLastName
if (filterEmail)        params.email        = filterEmail
if (filterPhoneNumber)  params.phoneNumber  = filterPhoneNumber


    try {
      const res = await axios.get<ClientCardDto[]>(
        'https://localhost:7181/api/clients',
        { params }
      )
      setClients(res.data)
      setIsFilterOpen(false)
    } catch (err) {
      console.error('Помилка застосування фільтрів:', err)
    }
  }

  return (
    <div className="relative bg-white shadow-sm p-4 rounded-xl flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-bold text-primary">Всього клієнтів: {total}</h2>
        <div className="flex items-center gap-2">
          {/* Пошук */}
          <input
            type="text"
            placeholder="Пошук по клієнтах…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />

          {/* Сортування */}
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as SortField)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="lastName">Прізвище</option>
            <option value="firstName">Ім'я</option>
            <option value="phoneNumber">Телефон</option>
            <option value="purchasesCount">К-ть покупок</option>
            <option value="lastPurchaseNumber">№ покупки</option>
            <option value="lastPurchaseDate">Дата покупки</option>
            <option value="lastPurchaseStatus">Статус покупки</option>
          </select>

          {/* Напрям сортування */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border rounded px-3 py-1 text-sm bg-white hover:bg-gray-100"
          >
            {sortOrder === 'asc' ? '⬆️ Зростання' : '⬇️ Спадання'}
          </button>

          {/* + Додати клієнта */}
          <button
            onClick={onAdd}
            className="border border-green-500 text-green-600 rounded px-3 py-1 text-sm hover:bg-green-50"
          >
            + Додати клієнта
          </button>

          {/* Відкрити фільтри */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-primary text-white text-sm px-3 py-1 rounded hover:opacity-90"
          >
            Фільтри
          </button>
        </div>
      </div>

      {/* Бічна панель фільтрів */}
      {isFilterOpen && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Фільтри</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 text-3xl">
              &times;
            </button>
          </div>
          <div className="flex flex-col gap-6 text-sm text-gray-700">
            {/* Ім’я клієнта */}
<div>
  <p className="font-semibold mb-1">Ім’я клієнта</p>
  <input
    type="text"
    value={filterFirstName}
    onChange={e => setFilterFirstName(e.target.value)}
    className="border rounded px-2 py-1 w-full"
    placeholder="Введіть ім’я"
  />
</div>

{/* Прізвище клієнта */}
<div>
  <p className="font-semibold mb-1">Прізвище клієнта</p>
  <input
    type="text"
    value={filterLastName}
    onChange={e => setFilterLastName(e.target.value)}
    className="border rounded px-2 py-1 w-full"
    placeholder="Введіть прізвище"
  />
</div>

            {/* Email клієнта */}
            <div>
              <p className="font-semibold mb-1">Email клієнта</p>
              <input
                type="text"
                value={filterEmail}
                onChange={e => setFilterEmail(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Введіть email"
              />
            </div>

            {/* Телефон клієнта */}
            <div>
              <p className="font-semibold mb-1">Телефон клієнта</p>
              <input
                type="text"
                value={filterPhoneNumber}
                onChange={e => setFilterPhoneNumber(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="Введіть телефон"
              />
            </div>


            {/* Діапазон кількості покупок */}
            <div>
              <p className="font-semibold mb-1">К-ть покупок (від – до)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Від"
                  min={0}
                  value={purchasesCountFrom}
                  onChange={e =>
                    setPurchasesCountFrom(e.target.value ? Number(e.target.value) : '')
                  }
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="number"
                  placeholder="До"
                  min={0}
                  value={purchasesCountTo}
                  onChange={e =>
                    setPurchasesCountTo(e.target.value ? Number(e.target.value) : '')
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            {/* Діапазон суми витрат */}
            <div>
              <p className="font-semibold mb-1">Сума витрат (від – до)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Від"
                  min={0}
                  value={totalSpentFrom}
                  onChange={e =>
                    setTotalSpentFrom(e.target.value ? Number(e.target.value) : '')
                  }
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="number"
                  placeholder="До"
                  min={0}
                  value={totalSpentTo}
                  onChange={e =>
                    setTotalSpentTo(e.target.value ? Number(e.target.value) : '')
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="mt-4 bg-primary text-white w-full py-2 rounded hover:opacity-90"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
