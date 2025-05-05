import { useState, useEffect } from 'react'
import axios from 'axios'
import { TransportBookingDto } from '../../constants/TourCardDto'

type BaseTour = {
  baseTourId: number
  duration: number
  description: string
  countryId:number
  cityId: number
  country: string
  city: string
  price: number
}

type Props = {
  onClose: () => void
  onSave: (created: any) => void
}

export default function AddTourModal({ onClose, onSave }: Props) {

  const [selectedCountry, setSelectedCountry] = useState<number>(0)
  const [selectedCity, setSelectedCity] = useState<number>(0)
  const [selectedBaseTour, setSelectedBaseTour] = useState<BaseTour | null>(null)
  const [startDate, setStartDate] = useState('')
  const [activityName, setActivityName] = useState('')
  const [activityCost, setActivityCost] = useState(0)
  const [baseTourPrice, setBaseTourPrice] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [filteredHotels, setFilteredHotels] = useState<{ hotelId: number; name: string; address: string }[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<{ hotelId: number; name: string; address: string } | null>(null)
  const [hotelBookingPrice, setHotelBookingPrice] = useState(0)
  const [hotelRoomNumber, setHotelRoomNumber] = useState('')
  const [transportBookings, setTransportBookings] = useState<TransportBookingDto[]>([])

type City = { cityId: number; name: string }
type TransportPoint = { transportPointId: number; name: string; transportType: string }

const [countries, setCountries] = useState<{ countryId: number; name: string }[]>([]);
const [cities, setCities] = useState<{ cityId: number; name: string }[]>([]);
const [baseTours, setBaseTours] = useState<BaseTour[]>([]);  // BaseTour містить cityId, countryId
const [activities, setActivities] = useState<string[]>([])
const [departureCities, setDepartureCities] = useState<City[][]>([])
const [arrivalCities, setArrivalCities] = useState<City[][]>([])
const [departurePointsByCity, setDeparturePointsByCity] = useState<TransportPoint[][]>([])
const [arrivalPointsByCity, setArrivalPointsByCity] = useState<TransportPoint[][]>([])

  useEffect(() => {
    loadCountries()
    loadActivities()
  }, [])

  useEffect(() => {
    if (selectedCountry) {
      loadCities(selectedCountry)
    }
  }, [selectedCountry])

  useEffect(() => {
    if (selectedCity) {
      loadBaseTours(selectedCity)
    }
  }, [selectedCity])

  useEffect(() => {
    const transportSum = transportBookings.reduce((sum, b) => sum + b.price, 0)
    const hotelCost = hotelBookingPrice
    const baseTourCost = selectedBaseTour?.price || 0
  
    setTotalCost(activityCost + baseTourCost)
  }, [activityCost, hotelBookingPrice, transportBookings, selectedBaseTour])
  
  
  

  useEffect(() => {
    if (selectedCity) {
      loadHotels(selectedCity);
    }
  }, [selectedCity]);
  
  useEffect(() => {
    if (selectedCity) {
      loadTransportPoints(selectedCity)
    }
  }, [selectedCity])
  
  useEffect(() => {
    transportBookings.forEach((b, idx) => {
      if (b.departureCountry) {
        axios
          .get<{ cityId: number; name: string }[]>(
            'https://localhost:7181/api/tour-classifiers/cities',
            { params: { countryId: b.departureCountry } }
          )
          .then((res) => {
            setDepartureCities((prev) => {
              const next = [...prev];
              next[idx] = res.data;
              return next;
            });
          });
      }
  
      if (b.departureCity) {
        axios
          .get<{ transportPointId: number; name: string; transportType: string }[]>(
            'https://localhost:7181/api/tour-classifiers/transport-points',
            { params: { cityId: b.departureCity } }
          )
          .then((res) => {
            setDeparturePointsByCity((prev) => {
              const next = [...prev];
              next[idx] = res.data;
              return next;
            });
          });
      }
      if (b.arrivalCountry) {
        axios
          .get<{ cityId: number; name: string }[]>(
            'https://localhost:7181/api/tour-classifiers/cities',
            { params: { countryId: b.arrivalCountry } }
          )
          .then((res) => {
            setArrivalCities((prev) => {
              const next = [...prev];
              next[idx] = res.data;
              return next;
            });
          });
      }
      if (b.arrivalCity) {
        axios
          .get<{ transportPointId: number; name: string; transportType: string }[]>(
            'https://localhost:7181/api/tour-classifiers/transport-points',
            { params: { cityId: b.arrivalCity } }
          )
          .then((res) => {
            setArrivalPointsByCity((prev) => {
              const next = [...prev];
              next[idx] = res.data;
              return next;
            });
          });
      }
    });
  }, [transportBookings]);

  const loadActivities = async () => {
    const res = await axios.get<string[]>('https://localhost:7181/api/tour-classifiers/activities')
    setActivities(res.data)
  }

  const loadBaseTours = async (cityId: number) => {
    const res = await axios.get<BaseTour[]>('https://localhost:7181/api/tour-classifiers/base-tours', {
      params: { cityId }
    });
    setBaseTours(res.data);
  };
  
  const loadHotels = async (cityId: number) => {
    try {
      const res = await axios.get<{ hotelId: number; name: string; city: string; address: string }[]>(
        'https://localhost:7181/api/tour-classifiers/hotels',
        { params: { cityId } }
      );
      setFilteredHotels(res.data);
    } catch (error) {
      console.error('Помилка завантаження готелів:', error);
    }
  };
  
  const loadCountries = async () => {
    const res = await axios.get<{ countryId: number; name: string }[]>('https://localhost:7181/api/tour-classifiers/countries');
    setCountries(res.data);
  };
  
  const loadCities = async (countryId: number) => {
    const res = await axios.get<{ cityId: number; name: string }[]>(
      'https://localhost:7181/api/tour-classifiers/cities',
      { params: { countryId } }
    );
    setCities(res.data);  // або setDepartureCities[index] = res.data для конкретного бронювання
  };
  
  const loadTransportPoints = async (cityId: number) => {
    const res = await axios.get<{ transportPointId: number; name: string; transportType: string }[]>(
      'https://localhost:7181/api/tour-classifiers/transport-points',
      { params: { cityId } }
    );
  };
  
  const addTransportBooking = () => {
    setTransportBookings(prev => [
      ...prev,
      {
        departureCountry: 0,
        departureCity: 0,
        departurePoint: 0,
        departurePointName:'',
        arrivalCountry: 0,
        arrivalCity: 0,
        arrivalPoint: 0,
        arrivalPointName:'',
        transportType: "",
        departureDate: '',
        arrivalDate: '',
        price: 0
      }
    ])
  }
  
  const removeTransportBooking = (index: number) => {
    const updated = [...transportBookings]
    updated.splice(index, 1)
    setTransportBookings(updated)
  }
  
  const handleTransportBookingChange = (index: number, field: keyof TransportBookingDto, value: any) => {
    const updated = [...transportBookings]
    updated[index] = { ...updated[index], [field]: value }
    setTransportBookings(updated)
  }
  
  const handleActivityChange = async (activity: string) => {
    setActivityName(activity)
    try {
      const res = await axios.get<number>('https://localhost:7181/api/tour-classifiers/activity-cost', {
        params: { activityName: activity }
      })
      setActivityCost(res.data)
    } catch (error) {
      console.error('Помилка завантаження вартості активності:', error)
      setActivityCost(0)
    }
  }
  
  
  const handleSave = async () => {
    if (!selectedBaseTour || !startDate || !activityName) {
      alert('Будь ласка, заповніть усі поля.')
      return
    }
  
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + selectedBaseTour.duration)
    
    const newTour = {
      city: selectedBaseTour.city, 
      country: selectedBaseTour.country,
      startDate,
      endDate: endDate.toISOString().split('T')[0],
      baseTourId: selectedBaseTour.baseTourId,
      baseTourPrice: selectedBaseTour.price,
      activityName,
      totalCost,
      employeeId: 1, // тимчасово
      checkInDate: startDate,
      duration: selectedBaseTour.duration,
      hotelRoomNumber: hotelRoomNumber,
      hotelBookingPrice: hotelBookingPrice,
      hotel: {
        hotelId: selectedHotel?.hotelId || 0,
        hotelName: selectedHotel?.name || '',
        hotelAddress: selectedHotel?.address || '',  // тобі треба підтягнути його у loadHotels
        hotelCity: cities.find(c => c.cityId === selectedCity)?.name || ''
      },
      
      
      transportBookings: transportBookings.map(tb => ({
        departureCountry: tb.departureCountry || 0,
        departureCity: tb.departureCity || 0,
        departurePoint: tb.departurePoint,
        departurePointName: tb.departurePointName || '',
        arrivalCountry: tb.arrivalCountry || 0,
        arrivalCity: tb.arrivalCity || 0,
        arrivalPoint: tb.arrivalPoint,
        arrivalPointName: tb.arrivalPointName || '',
        transportType: tb.transportType || '',
        departureDate: tb.departureDate,
        arrivalDate: tb.arrivalDate,
        price: tb.price
      }))
      
    }
  
    try {
      const response = await axios.post('https://localhost:7181/api/tour-manager/create-tour', newTour)
      onSave(response.data)
      onClose()
    } catch (error: any) {
      console.error('Помилка при створенні туру:', error)
      if (error.response) {
        console.error('Сервер відповів:', error.response.data)
      }
      alert('Помилка при створенні туру')
    }
    
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
  <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-primary">Новий тур</h2>
      <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500">&times;</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Країна</label>
        <select className="border p-2 rounded" value={selectedCountry} onChange={e => setSelectedCountry(Number(e.target.value))}>
          <option value="">Оберіть країну</option>
          {countries.map(c => <option key={c.countryId} value={c.countryId}>{c.name}</option>
)}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Місто</label>
        <select className="border p-2 rounded" value={selectedCity} onChange={e => setSelectedCity(Number(e.target.value))} disabled={!selectedCountry}>
          <option value="">Оберіть місто</option>
          {cities.map(c => <option key={c.cityId} value={c.cityId}>{c.name}</option> )}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Тривалість туру</label>
        <select
          className="border p-2 rounded"
          value={selectedBaseTour?.baseTourId || ''}
          onChange={e => {
            const baseTour = baseTours.find(bt => bt.baseTourId === +e.target.value)
            setSelectedBaseTour(baseTour || null)
          }}
          disabled={!selectedCity}
        >
          <option value="">Оберіть тривалість</option>
          {baseTours.map(bt => (
            <option key={bt.baseTourId} value={bt.baseTourId}>
              {bt.duration} days
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Дата початку</label>
        <input type="date" className="border p-2 rounded" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={!selectedBaseTour} />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Вид активності</label>
        <select
  className="border p-2 rounded"
  value={activityName}
  onChange={e => handleActivityChange(e.target.value)}
>
  <option value="">Оберіть активність</option>
  {activities.map(a => <option key={a} value={a}>{a}</option>)}
</select>

      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Загальна вартість ($)</label>
        <input
          type="number"
          value={totalCost}
          onChange={e => setTotalCost(Number(e.target.value))}
          className="border p-2 rounded"
          title="Можна змінити вручну"
        />
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="font-semibold mb-1">Готель</label>
        <select
  value={selectedHotel?.hotelId || ''}
  onChange={e => {
    const hotelId = Number(e.target.value);
    const hotel = filteredHotels.find(h => h.hotelId === hotelId);
    setSelectedHotel(hotel || null);
  }}
  className="border p-2 rounded"
>
  <option value="">Оберіть готель</option>
  {filteredHotels.map(h => (
    <option key={h.hotelId} value={h.hotelId}>
      {h.name}
    </option>
  ))}
</select>

      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Номер кімнати</label>
        <input
          value={hotelRoomNumber}
          onChange={e => setHotelRoomNumber(e.target.value)}
          className="border p-2 rounded"
          placeholder="Номер кімнати"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-semibold mb-1">Вартість бронювання готелю ($)</label>
        <input
          type="number"
          value={hotelBookingPrice}
          onChange={e => setHotelBookingPrice(Number(e.target.value))}
          className="border p-2 rounded"
          placeholder="Вартість"
        />
      </div>
    </div>

    <div className="mt-6">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">Транспортні бронювання</h3>
    <button
      onClick={addTransportBooking}
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
    >
      Додати бронювання
    </button>
  </div>

  <div className="space-y-4">
    {transportBookings.map((booking, index) => (
      <div key={index} className="border p-4 rounded-lg bg-gray-50">
        
        {/* Країни */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Країна відправлення</label>
            <select
              value={booking.departureCountry}
              onChange={e => handleTransportBookingChange(index, 'departureCountry', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Оберіть країну</option>
              {countries.map(c => <option key={c.countryId} value={c.countryId}>{c.name}</option>
)}
            </select>
          </div>

          <div></div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Країна прибуття</label>
            <select
              value={booking.arrivalCountry}
              onChange={e => handleTransportBookingChange(index, 'arrivalCountry', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Оберіть країну</option>
              {countries.map(c => <option key={c.countryId} value={c.countryId}>{c.name}</option>
)}
            </select>
          </div>
        </div>

        {/* Міста і тип транспорту */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Місто відправлення</label>
            <select
              value={booking.departureCity}
              onChange={e => handleTransportBookingChange(index, 'departureCity', Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value="">Оберіть місто</option>
              {departureCities[index]?.map(c => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Тип транспорту</label>
            <select value={booking.transportType} onChange={e => handleTransportBookingChange(index, 'transportType', e.target.value)}className="border p-2 rounded">
              <option value="">Оберіть тип</option>
              {Array.from(
                new Set(departurePointsByCity[index]?.map(p => p.transportType))
              )
                .filter(t => arrivalPointsByCity[index]?.some(p => p.transportType === t))
                .map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}</select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Місто прибуття</label>
            <select
              value={booking.arrivalCity}
              onChange={e => handleTransportBookingChange(index, 'arrivalCity', Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value="">Оберіть місто</option>
              {arrivalCities[index]?.map(c => <option key={c.cityId} value={c.cityId}>{c.name}</option>
)}
            </select>
          </div>
        </div>

        {/* Точки */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Точка відправлення</label>
            <select
              value={booking.departurePoint}
              onChange={e => handleTransportBookingChange(index, 'departurePoint', Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value="">Оберіть точку</option>
              {departurePointsByCity[index]
                ?.filter(p => p.transportType === booking.transportType)
                .map(p => (
                  <option key={p.transportPointId} value={p.transportPointId}>
                    {p.name} ({p.transportType})
                  </option>
                ))}
            </select>
          </div>
          <div></div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Точка прибуття</label>
            <select
              value={booking.arrivalPoint}
              onChange={e => handleTransportBookingChange(index, 'arrivalPoint', Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value="">Оберіть точку</option>
              {arrivalPointsByCity[index]
                ?.filter(p => p.transportType === booking.transportType)
                .map(p => (
                  <option key={p.transportPointId} value={p.transportPointId}>
                    {p.name} ({p.transportType})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Дати та ціна */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Дата відправлення</label>
            <input
              type="datetime-local"
              value={booking.departureDate}
              onChange={e => handleTransportBookingChange(index, 'departureDate', e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Дата прибуття</label>
            <input
              type="datetime-local"
              value={booking.arrivalDate}
              onChange={e => handleTransportBookingChange(index, 'arrivalDate', e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Ціна ($)</label>
            <input
              type="number"
              value={booking.price}
              onChange={e => handleTransportBookingChange(index, 'price', Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Кнопка видалення */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => removeTransportBooking(index)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Видалити
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    

    <div className="mt-4 flex justify-end gap-3">
      <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
        Скасувати
      </button>
      <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded hover:opacity-90">
        Створити тур
      </button>
    </div>
  </div>
</div>)
}
