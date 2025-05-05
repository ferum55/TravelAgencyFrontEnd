import { accessByRole, Role } from "../constants/AccessByRole";
import UserProfile from "./UserProfile";
// import Logo from "/assets/Logo.png"

type Props = {
  role: Role;
  onSelect: (table: string) => void;
  currentUser: string;
  currentTable: string | null;
};

const Sidebar = ({ role, onSelect, currentUser, currentTable }: Props) => {
  const items = accessByRole[role] ?? [];

  return (
    <aside className="w-64 bg-white p-4 flex flex-col justify-between border-r h-full">
      
      <div>
        {/* Лого + Назва */}
        <div className="flex items-center mb-6 space-x-3">
          {/* <img src={Logo} alt="SportComplex Logo" className="w-10 h-10" /> */}
          <h1 className="text-2xl font-bold text-primary">Travel Agency</h1>
        </div>

        {/* Меню */}
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = item === currentTable;
            return (
              <li 
                key = {item}
                className={`cursor-pointer px-2 py-1 rounded transition ${
                  isActive 
                    ? "text-primary font-semibold bg-gray-100"
                    : "text-gray-800 hover:text-primary"
                }`}
                onClick={() => onSelect(item)}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>

      <UserProfile username={currentUser} role={role}/>
    </aside>
  );
};

export default Sidebar;