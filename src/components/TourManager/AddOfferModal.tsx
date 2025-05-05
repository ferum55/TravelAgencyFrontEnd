import { useState, useEffect } from 'react'
import axios from 'axios'
import { TourOfferDto } from '../../constants/TourOfferDto'

type Country = {
  countryId: number
  name: string
}

type City = {
  cityId: number
  name: string
}

type Props = {
  onClose: () => void
  onSave: (created: TourOfferDto) => void
}

export default function AddOfferModal({ onClose, onSave }: Props) {
  const empty: TourOfferDto = {
    baseTourId: 0,
    countryId: 0,
    country: '',
    city: '',
    description: '',
    duration: 1,
    price: 0
  }

  const [edited, setEdited] = useState<TourOfferDto>(empty)
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [saving, setSaving] = useState(false)

  // Завантажуємо список країн
  useEffect(() => {
    axios
      .get<Country[]>('https://localhost:7181/api/tour-classifiers/countries')
      .then(res => setCountries(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
  }, [])

  // Завантажуємо список міст при виборі країни
  useEffect(() => {
    if (!edited.countryId || edited.countryId <= 0) {
      setCities([])
      setEdited(prev => ({ ...prev, city: '' }))
      return
    }

    axios
      .get<City[]>('https://localhost:7181/api/tour-classifiers/cities', {
        params: { countryId: edited.countryId }
      })
      .then(res => {
        const cityList = Array.isArray(res.data) ? res.data : []
        setCities(cityList)
        if (!cityList.find(c => c.name === edited.city)) {
          setEdited(prev => ({ ...prev, city: '' }))
        }
      })
      .catch(console.error)
  }, [edited.countryId])

  const handleCreateClick = async () => {
    setSaving(true)
    try {
      const res = await axios.post<TourOfferDto>(
        'https://localhost:7181/api/tour-manager/offers',
        edited
      )
      onSave(res.data)
      onClose()
    } catch (err) {
      console.error('Помилка створення пропозиції:', err)
      alert('Не вдалося створити пропозицію')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Нова пропозиція</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Країна */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Країна</label>
            <select
              value={edited.countryId}
              onChange={e => setEdited(prev => ({
                ...prev,
                countryId: Number(e.target.value)
              }))}
              className="border p-2 rounded"
            >
              <option value={0}>– оберіть країну –</option>
              {countries.map(c => (
                <option key={c.countryId} value={c.countryId}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Місто */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Місто</label>
            <select
              value={edited.city}
              onChange={e => setEdited(prev => ({ ...prev, city: e.target.value }))}
              disabled={!edited.countryId}
              className="border p-2 rounded disabled:opacity-50"
            >
              <option value="">– оберіть місто –</option>
              {cities.map(c => (
                <option key={c.cityId} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Тривалість */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Тривалість (днів)</label>
            <input
              type="number"
              min={1}
              value={edited.duration}
              onChange={e => setEdited(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="border p-2 rounded"
            />
          </div>

          {/* Вартість */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Вартість ($)</label>
            <input
              type="number"
              min={0}
              value={edited.price}
              onChange={e => setEdited(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="border p-2 rounded"
            />
          </div>

          {/* Опис */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold mb-1">Опис</label>
            <textarea
              value={edited.description}
              onChange={e => setEdited(prev => ({ ...prev, description: e.target.value }))}
              className="border p-2 rounded h-24 resize-none"
            />
          </div>
        </div>

        {/* Кнопки дій */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            disabled={saving}
          >
            Скасувати
          </button>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
            disabled={saving}
          >
            {saving ? 'Створення...' : 'Створити'}
          </button>
        </div>
      </div>
    </div>
  )
}
