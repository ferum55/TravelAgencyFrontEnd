import { useState, useRef, useEffect } from 'react'
import { TourCardDto } from '../../constants/TourCardDto'
import { highlightMatch } from '../../constants/highlightMatch'
import EditTourModal from './EditTourModal'

type Props = {
  tour: TourCardDto
  searchTerm: string
  expandedCardId: number | null
  setExpandedCardId: (id: number | null) => void
}

export default function TourCard({
  tour,
  searchTerm,
  expandedCardId,
  setExpandedCardId,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [localTour, setLocalTour] = useState<TourCardDto>(tour)

  const isExpanded = expandedCardId === localTour.tourId
  const contentRef = useRef<HTMLDivElement>(null)

  const handleExpandToggle = () => {
    setExpandedCardId(isExpanded ? null : localTour.tourId)
  }

  const handleSave = (updated: TourCardDto) => {
    setLocalTour(updated)
    setIsEditing(false)
  }

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (isExpanded) {
      content.style.maxHeight = content.scrollHeight + 'px'
      content.style.opacity = '1'
    } else {
      content.style.maxHeight = '0px'
      content.style.opacity = '0'
    }
  }, [isExpanded])

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2">
      {/* Верхній блок */}
      <div className="flex justify-between items-start text-sm text-gray-500">
        <div className="flex flex-col">
          <span className="font-semibold">{highlightMatch(localTour.country, searchTerm)}</span>
          <span>{highlightMatch(localTour.city, searchTerm)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right text-xs text-gray-400">
            <p>{new Date(localTour.startDate).toLocaleDateString()}</p>
            <p>{new Date(localTour.endDate).toLocaleDateString()}</p>
          </div>
          <button
            className="text-gray-400 hover:text-primary"
            title="Редагувати тур"
            onClick={() => setIsEditing(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 
                2.652 2.652L6.832 19.82a4.5 4.5 
                0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 
                0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
      </div>

      {/* Основна інформація */}
      <div>
        <h3 className="font-bold text-lg text-primary">
          {highlightMatch(localTour.activityName, searchTerm)}
        </h3>
        <p className="text-sm text-gray-700">Вартість туру: {localTour.totalCost} $</p>
      </div>

      <div className="mt-2 text-sm">
      <p>
  <span className="font-semibold">Готель:</span>{' '}
  {highlightMatch(localTour.hotel?.hotelName || 'Без готелю', searchTerm)}
</p>
        <p>
          <span className="font-semibold">Адреса готелю:</span>{' '}
          {tour.hotel?.hotelAddress || 'Немає даних'}
        </p>
        <p><span className="font-semibold">Номер кімнати:</span> {highlightMatch(localTour.hotelRoomNumber, searchTerm)}</p>
      </div>

      {/* Транспорт */}
      <div className="mt-2 text-sm">
        <button
          className="text-blue-500 hover:underline text-sm"
          onClick={handleExpandToggle}
        >
          {isExpanded ? 'Згорнути' : 'Показати інформацію про транспорт'}
        </button>

        {isExpanded && (
          <div ref={contentRef} className="expandable-content mt-2">
            <ul className="space-y-2 text-sm text-gray-700">
              {localTour.transportBookings.map((booking, i) => (
                <li key={i} className="border p-2 rounded-md bg-gray-50">
                  <p><span className="font-semibold">Тип транспорту:</span> {highlightMatch(booking.transportType, searchTerm)}</p>
                  <p><span className="font-semibold">Звідки:</span> {highlightMatch(booking.departurePointName, searchTerm)}</p>
<p><span className="font-semibold">Куди:</span> {highlightMatch(booking.arrivalPointName, searchTerm)}</p>
                  <p><span className="font-semibold">Дата відправлення:</span> {new Date(booking.departureDate).toLocaleString()}</p>
                  <p><span className="font-semibold">Дата прибуття:</span> {new Date(booking.arrivalDate).toLocaleString()}</p>
                  <p><span className="font-semibold">Ціна:</span> {booking.price} $</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Модалка */}
      {isEditing && (
        <EditTourModal
          tour={localTour}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}