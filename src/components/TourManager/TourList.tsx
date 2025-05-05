// src/components/TourManager/TourList.tsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import { TourCardDto } from '../../constants/TourCardDto'
import TourCard from './TourCard'
import TourHeader from './TourHeader'
import AddTourModal from './AddTourModal'

const ITEMS_PER_PAGE = 15

function getFieldValue(tour: TourCardDto, field: string) {
  if (field.startsWith('hotel.')) {
    const hotelField = field.split('.')[1] as keyof TourCardDto['hotel']
    return tour.hotel ? tour.hotel[hotelField] : ''
  }
  return (tour as any)[field]
}

function sortTours(
  tours: TourCardDto[],
  field: string,
  ascending: boolean
) {
  return [...tours].sort((a, b) => {
    const aValue = getFieldValue(a, field)
    const bValue = getFieldValue(b, field)

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    return 0
  })
}

export default function TourList() {
  const [allTours, setAllTours] = useState<TourCardDto[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null)
  const [sortField, setSortField] = useState<string>('startDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Завантажуємо тури з бекенду при зміні пошукового терміну
  useEffect(() => {
    axios
      .get<TourCardDto[]>('https://localhost:7181/api/tour-manager/tours', {
        params: { searchTerm }
      })
      .then(res => {
        console.log('🚀 Отримані тури з бекенду:', res.data)
        setAllTours(res.data)
        setCurrentPage(1)
      })
      .catch(err => console.error('Помилка завантаження:', err))
  }, [searchTerm])

  const totalPages = Math.ceil(allTours.length / ITEMS_PER_PAGE)
  const sortedTours = sortTours(allTours, sortField, sortOrder === 'asc')
  const visibleTours = sortedTours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const renderPagination = () => {
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages.map((page, idx) =>
      typeof page === 'number' ? (
        <button
          key={idx}
          onClick={() => setCurrentPage(page)}
          className={`w-8 h-8 rounded text-sm ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-white border text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ) : (
        <span key={idx} className="px-2 text-gray-400 text-sm">
          …
        </span>
      )
    )
  }

  return (
    <div className={`flex flex-col gap-6 ${isFilterOpen ? 'w-[75%]' : 'w-[100%]'}`}>
      {/* Хедер з пошуком, сортуванням, фільтрами та кнопкою "Додати тур" */}
      <TourHeader
        total={allTours.length}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setTours={setAllTours}
        onAdd={() => setIsAddOpen(true)}
      />

      {/* Модалка для створення нового туру */}
      {isAddOpen && (
        <AddTourModal
          onClose={() => setIsAddOpen(false)}
          onSave={(newTour) => {
            setAllTours(prev => [newTour, ...prev])
            setIsAddOpen(false)
          }}
        />
      )}


      {/* Сітка з картками турів */}
      <div
        className={`grid gap-4 grid-cols-1 md:grid-cols-2 ${
          isFilterOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-3'
        } items-start`}
      >
        {visibleTours.map(t => (
          <TourCard
            key={t.tourId}
            tour={t}
            searchTerm={searchTerm}
            expandedCardId={expandedCardId}
            setExpandedCardId={setExpandedCardId}
          />
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

        {renderPagination()}

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
