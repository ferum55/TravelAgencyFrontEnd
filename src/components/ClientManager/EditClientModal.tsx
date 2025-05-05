// src/components/ClientManager/EditClientModal.tsx

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ClientCardDto, PurchaseDto } from '../../constants/ClientCardDto'

type StatusOption = {
  statusId: number
  statusName: string
}
type Option = {
  id: number;
  name: string;
};


interface NewPurchaseForm {
  purchaseNumber?: string
  purchaseDate?: string
  status?: string

  // нові id-поля
  countryId?: number
  cityId?: number
  duration?: number
  activityTypeId?: number
  insuranceType?: string
  insuranceCompanyId?: number
}

type Country = { countryId: number; name: string; };
type City = { cityId: number; name: string; };
type ActivityType = { activityTypeId: number; name: string; };
type InsuranceCompany = { insuranceCompanyId: number; name: string; };
type InsuranceType = { insuranceType: string; };





type Props = {
  client: ClientCardDto
  onClose: () => void
  onSave: (updated: ClientCardDto) => void
}

export default function EditClientModal({ client, onClose, onSave }: Props) {
  const [edited, setEdited] = useState<ClientCardDto>(client)
  const [statuses, setStatuses] = useState<StatusOption[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPurchase, setNewPurchase] = useState<NewPurchaseForm>({})
  const [saving, setSaving] = useState(false)


const [durations, setDurations] = useState<number[]>([]);


const [countries, setCountries] = useState<Country[]>([]);
const [cities, setCities] = useState<City[]>([]);
const [activityTypes, setActivityTypes] = useState<string[]>([]);
const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
const [insuranceTypes, setInsuranceTypes] = useState<string[]>([]);


useEffect(() => {
  axios.get('https://localhost:7181/api/tour-classifiers/durations')
    .then(res => {
      console.log('Loaded durations:', res.data);
      setDurations(res.data);
    })
    .catch(err => {
      console.error('Failed to load durations', err);
    });
}, []);


useEffect(() => {
  axios.get('https://localhost:7181/api/clients/purchase-statuses')
    .then(res => {
      console.log('Loaded statuses:', res.data); // перевіримо в консолі
      setStatuses(res.data);
    })
    .catch(err => {
      console.error('Failed to load statuses', err);
    });
}, []);


useEffect(() => {
  axios.get('https://localhost:7181/api/tour-classifiers/countries')
    .then(res => setCountries(Array.isArray(res.data) ? res.data : []))
    .catch(() => setCountries([]));

  axios.get('https://localhost:7181/api/tour-classifiers/activities')
    .then(res => setActivityTypes(Array.isArray(res.data) ? res.data : []))
    .catch(() => setActivityTypes([]));

  axios.get('https://localhost:7181/api/tour-classifiers/insurance-types')
    .then(res => setInsuranceTypes(Array.isArray(res.data) ? res.data : []))
    .catch(() => setInsuranceTypes([]));

  axios.get('https://localhost:7181/api/tour-classifiers/insurance-companies')
    .then(res => setInsuranceCompanies(Array.isArray(res.data) ? res.data : []))
    .catch(() => setInsuranceCompanies([]));
}, []);

  const handleClientChange = (
    field: keyof Omit<ClientCardDto, 'clientId' | 'purchases'>,
    value: any
  ) => setEdited(prev => ({ ...prev, [field]: value }))

  const handleCountryChange = (countryId: number) => {
    handleAddFieldChange('countryId', countryId);
    axios.get(`https://localhost:7181/api/tour-classifiers/cities?countryId=${countryId}`)
      .then(res => setCities(res.data));
  };
  

  const handlePurchaseChange = (
    idx: number,
    field: keyof PurchaseDto,
    value: any
  ) => {
    const list = [...edited.purchases]
    list[idx] = { ...list[idx], [field]: value }
    setEdited(prev => ({ ...prev, purchases: list }))
  }

  const handleAddFieldChange = (field: keyof NewPurchaseForm, value: any) =>
    setNewPurchase(prev => ({ ...prev, [field]: value }))

  const handleAddPurchase = async () => {
    try {
      const { data: created } = await axios.post<PurchaseDto>(
        `https://localhost:7181/api/clients/${edited.clientId}/purchases`,
        newPurchase
      )
      setEdited(prev => ({
        ...prev,
        purchases: [...prev.purchases, created]
      }))
      setShowAddForm(false)
      setNewPurchase({})
    } catch {
      alert('Не вдалося додати покупку')
    }
  }

  const handleRemovePurchase = (idx: number) => {
    const list = [...edited.purchases]
    list.splice(idx, 1)
    setEdited(prev => ({ ...prev, purchases: list }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put(`https://localhost:7181/api/clients/${edited.clientId}`, edited)
      onSave(edited)
      onClose()
    } catch {
      alert('Не вдалося зберегти')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Редагувати клієнта</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Client fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Прізвище</label>
            <input
              type="text"
              value={edited.lastName}
              onChange={e => handleClientChange('lastName', e.target.value)}
              className="border p-2 rounded"
              disabled={saving}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Ім’я</label>
            <input
              type="text"
              value={edited.firstName}
              onChange={e => handleClientChange('firstName', e.target.value)}
              className="border p-2 rounded"
              disabled={saving}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">По батькові</label>
            <input
              type="text"
              value={edited.middleName || ''}
              onChange={e => handleClientChange('middleName', e.target.value)}
              className="border p-2 rounded"
              disabled={saving}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Телефон</label>
            <input
              type="tel"
              value={edited.phoneNumber}
              onChange={e => handleClientChange('phoneNumber', e.target.value)}
              className="border p-2 rounded"
              disabled={saving}
            />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="font-semibold mb-1">Email</label>
            <input
              type="email"
              value={edited.email}
              onChange={e => handleClientChange('email', e.target.value)}
              className="border p-2 rounded"
              disabled={saving}
            />
          </div>
        </div>

        {/* Purchases Section */}
<h3 className="text-lg font-semibold mb-2">Покупки</h3>

{/* Додати покупку */}
<div className="mb-4">
  <button
    onClick={() => setShowAddForm(true)}
    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
  >
    Додати покупку
  </button>
</div>

{/* Форма додавання покупки */}
{showAddForm && (
  <div className="border p-4 rounded-lg mb-4 bg-gray-50 space-y-3">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
    {/* Номер */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Номер</label>
      <input
        onChange={e => handleAddFieldChange('purchaseNumber', e.target.value)}
        className="border p-2 rounded"
      />
    </div>

    {/* Дата */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Дата</label>
      <input
        type="date"
        onChange={e => handleAddFieldChange('purchaseDate', e.target.value)}
        className="border p-2 rounded"
      />
    </div>

    {/* Статус */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Статус</label>
      <select
        onChange={e => handleAddFieldChange('status', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {statuses.map(s => (
          <option key={s.statusId} value={s.statusName}>
            {s.statusName}
          </option>
        ))}
      </select>
    </div>

    {/* Країна */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Країна</label>
      <select
        onChange={e => handleCountryChange(Number(e.target.value))}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {countries.map(c => (
          <option key={c.countryId} value={c.countryId}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    {/* Місто */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Місто</label>
      <select
  onChange={e => handleAddFieldChange('cityId', Number(e.target.value))}
  className="border p-2 rounded"
>
  <option value="">–</option>
  {cities.map(c => (
    <option key={c.cityId} value={c.cityId}>
      {c.name}
    </option>
  ))}
</select>

    </div>

    {/* Тривалість */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Тривалість (днів)</label>
      <select
        onChange={e => handleAddFieldChange('duration', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {durations.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>

    {/* Вид активності */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Вид активності</label>
      <select
        onChange={e => handleAddFieldChange('activityTypeId', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {activityTypes.map(a => (
           <option key={a} value={a}>
           {a}
         </option>
        ))}
      </select>
    </div>

    {/* Тип страхування */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Тип страхування</label>
      <select
        onChange={e => handleAddFieldChange('insuranceType', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {insuranceTypes.map(t => (
  <option key={t} value={t}>
    {t}
  </option>
))}
      </select>
    </div>

    {/* Компанія страхування */}
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Компанія страхування</label>
      <select
        onChange={e => handleAddFieldChange('insuranceCompanyId', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">–</option>
        {insuranceCompanies.map(c => (
          <option key={c.insuranceCompanyId} value={c.insuranceCompanyId}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="flex justify-end gap-3 mt-4">
    <button
      onClick={() => setShowAddForm(false)}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
    >
      Відмінити
    </button>
    <button
      onClick={handleAddPurchase}
      className="px-3 py-1 bg-primary text-white rounded hover:opacity-90 text-sm"
    >
      Додати
    </button>
  </div>
</div>
)}
<div className="space-y-4">
  {edited.purchases.map((p, idx) => (
    <div key={p.tourPurchaseId} className="border rounded-lg p-4 bg-gray-50">
      {/* Purchase display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        {/* Номер покупки */}
        <input
          value={p.purchaseNumber}
          onChange={(e) =>
            handlePurchaseChange(idx, 'purchaseNumber', e.target.value)
          }
          className="border p-2 rounded"
        />
        {/* Дата покупки */}
        <input
          type="date"
          value={p.purchaseDate.split('T')[0]}
          onChange={(e) =>
            handlePurchaseChange(idx, 'purchaseDate', e.target.value)
          }
          className="border p-2 rounded"
        />
        {/* Вартість */}
        <input
          type="number"
          value={p.price}
          onChange={(e) =>
            handlePurchaseChange(idx, 'price', Number(e.target.value))
          }
          className="border p-2 rounded"
        />
        {/* Статус */}
        <select
          value={p.statusId}
          onChange={(e) =>
            handlePurchaseChange(idx, 'statusId', Number(e.target.value))
          }
          className="border p-2 rounded"
        >
          {statuses.map((status) => (
            <option key={status.statusId} value={status.statusId}>
              {status.statusName}
            </option>
          ))}
        </select>
      </div>

      {/* Tour details */}
      <div className="mt-3 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Країна:</span> {p.country}
        </p>
        <p>
          <span className="font-semibold">Місто:</span> {p.city}
        </p>
        <p className="whitespace-nowrap">
          <span className="font-semibold">Період:</span>{' '}
          {new Date(p.startDate).toLocaleDateString()} –{' '}
          {new Date(p.endDate).toLocaleDateString()}
        </p>
      </div>

      {/* Insurance details */}
      <h4 className="mt-4 text-base font-semibold text-primary">
        Страхування
      </h4>
      <div className="mt-1 text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-semibold">Тип поліса:</span>{' '}
          {p.insuranceType}
        </p>
        <p>
          <span className="font-semibold">Компанія:</span>{' '}
          {p.insuranceCompanyName}
        </p>
        <p>
          <span className="font-semibold">Оплата:</span>{' '}
          {p.paymentAmount} $
        </p>
        <p>
          <span className="font-semibold">Покриття:</span>{' '}
          {p.coverageAmount} $
        </p>
        <p>
          <span className="font-semibold">Ризики:</span>{' '}
          {(p.coveredRisks ?? []).join(', ')}
        </p>
      </div>

      {/* Remove button */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => handleRemovePurchase(idx)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          disabled={saving}
        >
          Видалити
        </button>
      </div>
    </div>
  ))}
</div>



        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
          >
            Скасувати
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 text-sm"
          >
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  )
}
