import { useState, useEffect } from 'react'
import axios from 'axios'
import { TourCardDto } from '../../constants/TourCardDto'

type Props = {
  total: number
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortField: string
  setSortField: (field: string) => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  setTours: (tours: TourCardDto[]) => void
  onAdd: () => void
}

export default function TourHeader({
  total,
  isFilterOpen,
  setIsFilterOpen,
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setTours,
  onAdd
}: Props) {
  const [countries, setCountries] = useState<{ countryId: number; name: string }[]>([])
  const [cities, setCities] = useState<{ cityId: number; name: string }[]>([])
  const [activities, setActivities] = useState<string[]>([])

  const [filterCountry, setFilterCountry] = useState<number | ''>('')
  const [filterCity, setFilterCity] = useState<number | ''>('')
  const [filterActivity, setFilterActivity] = useState('')
  const [filterStartDateFrom, setFilterStartDateFrom] = useState('')
  const [filterStartDateTo, setFilterStartDateTo] = useState('')
  const [filterEndDateFrom, setFilterEndDateFrom] = useState('')
  const [filterEndDateTo, setFilterEndDateTo] = useState('')
  const [filterPriceFrom, setFilterPriceFrom] = useState<number | ''>('')
  const [filterPriceTo, setFilterPriceTo] = useState<number | ''>('')

  const [showOngoing, setShowOngoing] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showUpcoming, setShowUpcoming] = useState(false)

  useEffect(() => {
    loadCountries()
    loadActivities()
  }, [])

  useEffect(() => {
    if (filterCountry) loadCities(filterCountry)
    else setCities([]) // очищуємо, якщо країну зняли
  }, [filterCountry])

  const loadCountries = async () => {
    try {
      const res = await axios.get('https://localhost:7181/api/tour-classifiers/countries')
      setCountries(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Помилка завантаження країн:', error)
    }
  }

  const loadCities = async (countryId: number) => {
    try {
      const res = await axios.get('https://localhost:7181/api/tour-classifiers/cities', { params: { countryId } })
      setCities(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Помилка завантаження міст:', error)
    }
  }

  const loadActivities = async () => {
    try {
      const res = await axios.get('https://localhost:7181/api/tour-classifiers/activities')
      setActivities(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Помилка завантаження активностей:', error)
    }
  }

  const applyFilters = async () => {
    const params: any = {}

    if (filterCountry) params.countryId = filterCountry  // ← це буде number, а не name
    if (filterCity) params.cityId = filterCity          // ← теж number
    
    if (filterActivity) params.activityName = filterActivity
    if (filterStartDateFrom) params.startDateFrom = filterStartDateFrom
    if (filterStartDateTo) params.startDateTo = filterStartDateTo
    if (filterEndDateFrom) params.endDateFrom = filterEndDateFrom
    if (filterEndDateTo) params.endDateTo = filterEndDateTo
    if (filterPriceFrom !== '') params.priceFrom = filterPriceFrom
    if (filterPriceTo !== '') params.priceTo = filterPriceTo

    try {
      const response = await axios.get<TourCardDto[]>('https://localhost:7181/api/tour-manager/tours-with-filters', { params })
      let tours = response.data

      const today = new Date()

      if (showOngoing) {
        tours = tours.filter(t => new Date(t.startDate) <= today && new Date(t.endDate) >= today)
      }
      if (showCompleted) {
        tours = tours.filter(t => new Date(t.endDate) < today)
      }
      if (showUpcoming) {
        tours = tours.filter(t => new Date(t.startDate) > today)
      }

      setTours(tours)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Помилка застосування фільтрів:', error)
    }
  }

  return (
    <div className="relative bg-white shadow-sm p-4 rounded-xl flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-bold text-primary">Всього турів: {total}</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Пошук по турах..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="startDate">Дата початку</option>
            <option value="endDate">Дата завершення</option>
            <option value="country">Країна</option>
            <option value="city">Місто</option>
            <option value="activityName">Вид активності</option>
            <option value="totalCost">Вартість туру</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border rounded px-3 py-1 text-sm bg-white hover:bg-gray-100"
          >
            {sortOrder === 'asc' ? '⬆️ Зростання' : '⬇️ Спадання'}
          </button>
          <button
            onClick={onAdd}
            className="border border-green-500 text-green-600 rounded px-3 py-1 text-sm hover:bg-green-50"
          >
            + Додати тур
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-primary text-white text-sm px-3 py-1 rounded hover:opacity-90"
          >
            Фільтри
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Фільтри</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 text-3xl">
              &times;
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1">Країна:</p>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value ? Number(e.target.value) : '')}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Всі</option>
                {Array.isArray(countries) &&
                  countries.map(c => (
                    <option key={c.countryId} value={c.countryId}>{c.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <p className="font-semibold mb-1">Місто:</p>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value ? Number(e.target.value) : '')}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Всі</option>
                {Array.isArray(cities) &&
                  cities.map(c => (
                    <option key={c.cityId} value={c.cityId}>{c.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <p className="font-semibold mb-1">Вид активності:</p>
              <select
                value={filterActivity}
                onChange={(e) => setFilterActivity(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Всі</option>
                {Array.isArray(activities) &&
                  activities.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
              </select>
            </div>

            <div>
              <p className="font-semibold mb-1">Дата початку (з - по):</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterStartDateFrom}
                  onChange={(e) => setFilterStartDateFrom(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="date"
                  value={filterStartDateTo}
                  onChange={(e) => setFilterStartDateTo(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">Дата завершення (з - по):</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterEndDateFrom}
                  onChange={(e) => setFilterEndDateFrom(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="date"
                  value={filterEndDateTo}
                  onChange={(e) => setFilterEndDateTo(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">Вартість туру ($):</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filterPriceFrom}
                  onChange={(e) => setFilterPriceFrom(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Від"
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="number"
                  value={filterPriceTo}
                  onChange={(e) => setFilterPriceTo(e.target.value ? Number(e.target.value) : '')}
                  placeholder="До"
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label>
                <input type="checkbox" checked={showOngoing} onChange={() => setShowOngoing(!showOngoing)} />
                <span className="ml-2">Йдуть зараз</span>
              </label>
              <label>
                <input type="checkbox" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
                <span className="ml-2">Завершені</span>
              </label>
              <label>
                <input type="checkbox" checked={showUpcoming} onChange={() => setShowUpcoming(!showUpcoming)} />
                <span className="ml-2">Заплановані</span>
              </label>
            </div>

            <button
              onClick={applyFilters}
              className="mt-4 bg-primary text-white w-full py-2 rounded hover:opacity-90"
            >
              Застосувати фільтри
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
