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
  total: number
  isFilterOpen: boolean
  setIsFilterOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortField: 'country' | 'city' | 'duration' | 'price'
  setSortField: (field: 'country' | 'city' | 'duration' | 'price') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  setOffers: (offers: TourOfferDto[]) => void
  onAdd: () => void
}

export default function OfferHeader({
  total,
  isFilterOpen,
  setIsFilterOpen,
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setOffers,
  onAdd
}: Props) {
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [filterCountryId, setFilterCountryId] = useState<number | null>(null)
  const [filterCity, setFilterCity] = useState('')
  const [filterDurationFrom, setFilterDurationFrom] = useState<number | ''>('')
  const [filterDurationTo, setFilterDurationTo] = useState<number | ''>('')
  const [filterPriceFrom, setFilterPriceFrom] = useState<number | ''>('')
  const [filterPriceTo, setFilterPriceTo] = useState<number | ''>('')

  useEffect(() => {
    axios
      .get<Country[]>('https://localhost:7181/api/tour-classifiers/countries')
      .then(res => setCountries(res.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!filterCountryId) {
      setCities([])
      setFilterCity('')
      return
    }
    axios
      .get<City[]>('https://localhost:7181/api/tour-classifiers/cities', {
        params: { countryId: filterCountryId }
      })
      .then(res => setCities(res.data))
      .catch(console.error)
  }, [filterCountryId])

  const applyFilters = async () => {
    const params: any = { searchTerm }
    if (filterCountryId) params.countryId = filterCountryId
    if (filterCity) params.cityName = filterCity
    if (filterDurationFrom !== '') params.durationFrom = filterDurationFrom
    if (filterDurationTo !== '') params.durationTo = filterDurationTo
    if (filterPriceFrom !== '') params.priceFrom = filterPriceFrom
    if (filterPriceTo !== '') params.priceTo = filterPriceTo

    const res = await axios.get<TourOfferDto[]>(
      'https://localhost:7181/api/tour-manager/offers',
      { params }
    )
    setOffers(res.data)
    setIsFilterOpen(false)
  }

  return (
    <div className="relative bg-white shadow-sm p-4 rounded-xl flex flex-col gap-4">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-bold text-primary">Всього пропозицій: {total}</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Пошук…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          />

          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="country">Країна</option>
            <option value="city">Місто</option>
            <option value="duration">Тривалість</option>
            <option value="price">Вартість</option>
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
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Фільтри</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 text-3xl">
              &times;
            </button>
          </div>
          <div className="flex flex-col gap-6 text-sm text-gray-700">
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-semibold mb-1">Країна</label>
                <select
                  value={filterCountryId || ''}
                  onChange={e =>
                    setFilterCountryId(e.target.value === '' ? null : Number(e.target.value))
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">– оберіть країну –</option>
                  {countries.map(c => (
                    <option key={c.countryId} value={c.countryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold mb-1">Місто</label>
                <select
                  value={filterCity}
                  onChange={e => setFilterCity(e.target.value)}
                  disabled={!filterCountryId}
                  className="border p-2 rounded w-full disabled:opacity-50"
                >
                  <option value="">– оберіть місто –</option>
                  {cities.map(c => (
                    <option key={c.cityId} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Тривалість від</label>
                  <input
                    type="number"
                    min={1}
                    value={filterDurationFrom}
                    onChange={e =>
                      setFilterDurationFrom(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Тривалість до</label>
                  <input
                    type="number"
                    min={1}
                    value={filterDurationTo}
                    onChange={e =>
                      setFilterDurationTo(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Вартість від ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={filterPriceFrom}
                    onChange={e =>
                      setFilterPriceFrom(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold mb-1">Вартість до ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={filterPriceTo}
                    onChange={e =>
                      setFilterPriceTo(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
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
