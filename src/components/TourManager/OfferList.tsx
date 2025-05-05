// src/components/TourManager/OfferList.tsx

import { useEffect, useState } from 'react'
import axios from 'axios'
import { TourOfferDto } from '../../constants/TourOfferDto'
import OfferHeader from './OfferHeader'
import OfferCard from './OfferCard'
import AddOfferModal from './AddOfferModal' // ← створіть цей файл

const ITEMS_PER_PAGE = 15

export default function OfferList() {
  const [offers, setOffers] = useState<TourOfferDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'country'|'city'|'duration'>('country')
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('asc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    axios
      .get<TourOfferDto[]>('https://localhost:7181/api/tour-manager/offers', { params: { searchTerm } })
      .then(res => {
        setOffers(res.data)
        setCurrentPage(1)
      })
      .catch(console.error)
  }, [searchTerm])

  const sorted = [...offers].sort((a, b) => {
    const aV = a[sortField], bV = b[sortField]
    if (typeof aV === 'string' && typeof bV === 'string') {
      return sortOrder === 'asc'
        ? aV.localeCompare(bV)
        : bV.localeCompare(aV)
    }
    if (typeof aV === 'number' && typeof bV === 'number') {
      return sortOrder === 'asc' ? aV - bV : bV - aV
    }
    return 0
  })
  const visible = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className={`flex flex-col gap-6 ${isFilterOpen ? 'w-[75%]' : 'w-[100%]'}`}>
      <OfferHeader
        total={offers.length}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setOffers={setOffers}
        onAdd={() => setIsAddOpen(true)}       // ← передаємо сюди
      />

      {isAddOpen && (
        <AddOfferModal
          onClose={() => setIsAddOpen(false)}
          onSave={newOffer => {
            setOffers(prev => [newOffer, ...prev])
            setIsAddOpen(false)
          }}
        />
      )}

      <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-3'}`}>
        {visible.map(o => (
          <OfferCard key={o.baseTourId} offer={o} />
        ))}
      </div>

      {/* ... пагінація ... */}
    </div>
  )
}
