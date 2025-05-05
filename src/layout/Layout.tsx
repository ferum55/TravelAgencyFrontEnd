import Sidebar from './Sidebar'
import { useState } from "react";
import {useAuth} from "../components/AuthContext"
import TourList from '../components/TourManager/TourList';
import TourOffers from '../components/TourManager/OfferList';
import ClientList from '../components/ClientManager/ClientList';

export default function Layout()
{
  const [currentTable, setCurrentTable] = useState<string | null>(null);
  const {user} = useAuth();

  if (!user)
    return null;

  return (
    <div className="flex flex-col h-screen">

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          role={user.role}
          currentUser={user.username}
          onSelect={setCurrentTable}
          currentTable={currentTable}
        />

<main className="flex-1 p-6 overflow-auto">
        {!currentTable && <div>Виберіть таблицю</div>}

        {currentTable === "Tours" && user.role === "TourManager" && (
          <TourList />
        )}

        {currentTable === "TourOffers" && user.role === "TourManager" && (
          <TourOffers />
        )}

        {currentTable !== "Purchases" && currentTable && (
          <div>Вміст таблиці: {currentTable}</div>
        )}

          {currentTable === "ClientInfo" && user.role === "ClientManager" && (
                    <ClientList />
          )}

        </main>
      </div>
    </div>
  );
}