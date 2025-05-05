// src/components/ClientManager/ClientCard.tsx

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ClientCardDto, PurchaseDto } from '../../constants/ClientCardDto'
import EditClientModal from './EditClientModal'

type Props = {
  client: ClientCardDto
}

export default function ClientCard({ client }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [localClient, setLocalClient] = useState<ClientCardDto>(client)
  const [showPurchases, setShowPurchases] = useState(false)

  const handleSaveClient = (updated: ClientCardDto) => {
    setLocalClient(updated)
    setIsEditing(false)
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-4">
        {/* Заголовок клієнта */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-primary">
              {localClient.lastName} {localClient.firstName}
            </h3>
            <p className="text-sm text-gray-500">
              {localClient.phoneNumber} &bull; {localClient.email}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-primary"
            title="Редагувати клієнта"
            onClick={() => setIsEditing(true)}
          >
            🖉
          </button>
        </div>

        {/* Кнопка показати/сховати покупки */}
        <button
          className="text-blue-500 hover:underline text-sm self-start"
          onClick={() => setShowPurchases(prev => !prev)}
        >
          {showPurchases ? 'Сховати покупки' : 'Показати покупки'}
        </button>

        {/* Список покупок (відображається лише коли showPurchases=true) */}
        {showPurchases && (
          <div className="space-y-4">
            {localClient.purchases.map((p: PurchaseDto) => (
              <div key={p.tourPurchaseId} className="border rounded-lg p-3">
                {/* Існуючі дані по купівлі і туру */}
                <div className="space-y-1 text-sm">
                  <p className="font-semibold"># {p.purchaseNumber}</p>
                  <p>Дата: {new Date(p.purchaseDate).toLocaleDateString()}</p>
                  <p>
                    Статус: <span className="font-medium">{p.status}</span>
                  </p>
                  <p>
                    Вартість: <span className="font-medium">{p.price} $</span>
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Країна:</span> {p.country}
                  </p>
                  <p>
                    <span className="font-semibold">Місто:</span> {p.city}
                  </p>
                  <p>
                    <span className="font-semibold">Період:</span>{' '}
                    {new Date(p.startDate).toLocaleDateString()} –{' '}
                    {new Date(p.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Нова секція: інформація про страхування */}
                <div className="mt-3 p-2 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold">Страхування</p>
                  <p>
                    Тип: <span className="font-medium">{p.insuranceType}</span>
                  </p>
                  <p>
                    Компанія:{' '}
                    <span className="font-medium">{p.insuranceCompanyName}</span>
                  </p>
                  <p>
                    Оплата: <span className="font-medium">{p.paymentAmount} $</span>
                  </p>
                  <p>
                    Покриття:{' '}
                    <span className="font-medium">{p.coverageAmount} $</span>
                  </p>
                  <p>
                    Ризики:{' '}
                    <span className="font-medium">
                      {(p.coveredRisks ?? []).join(', ')}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка редагування — через портал */}
      {isEditing &&
        createPortal(
          <EditClientModal
            client={localClient}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveClient}
          />,
          document.body
        )}
    </>
  )
}
