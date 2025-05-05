// src/components/TourManager/OfferCard.tsx

import { useState, useRef, useEffect } from 'react'
import { TourOfferDto } from '../../constants/TourOfferDto'
import EditOfferModal from './EditOfferModal'

type Props = {
  offer: TourOfferDto
}

export default function OfferCard({ offer }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [localOffer, setLocalOffer] = useState<TourOfferDto>(offer)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleExpand = () => setIsExpanded(prev => !prev)

  const handleSave = (updated: TourOfferDto) => {
    setLocalOffer(updated)
    setIsEditing(false)
  }

  // анімація розгортання
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (isExpanded) {
      el.style.maxHeight = el.scrollHeight + 'px'
      el.style.opacity = '1'
    } else {
      el.style.maxHeight = '0px'
      el.style.opacity = '0'
    }
  }, [isExpanded])

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2">
      {/* Верхній блок: місто, країна, кнопка редагувати */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-primary">{localOffer.city}</h3>
          <p className="text-sm text-gray-500">{localOffer.country}</p>
        </div>
        <button
          className="text-gray-400 hover:text-primary"
          title="Редагувати пропозицію"
          onClick={() => setIsEditing(true)}
        >
          🖉
        </button>
      </div>

      {/* Тривалість */}
      <p className="text-sm text-gray-700">Тривалість: {localOffer.duration} днів</p>

      {/* Ціна */}
      <p className="text-sm text-gray-700">Вартість: {localOffer.price} $</p>


      {/* Кнопка "Докладніше" */}
      <button
        className="text-blue-500 hover:underline text-sm"
        onClick={toggleExpand}
      >
        {isExpanded ? 'Сховати опис' : 'Докладніше'}
      </button>

      {/* Опис (колапс) */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200 ease-in-out text-sm text-gray-700 mt-2"
        style={{ maxHeight: 0, opacity: 0 }}
      >
        <p>{localOffer.description}</p>
      </div>

      {/* Модалка редагування */}
      {isEditing && (
        <EditOfferModal
          offer={localOffer}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
