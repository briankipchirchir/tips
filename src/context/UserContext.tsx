import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  plan: 'GOLD' | 'SILVER' | 'BRONZE' | 'FREE';
}

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Omit<User, 'id'>) => void;
  deleteUser: (id: number) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'GOLD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'SILVER' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'BRONZE' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', plan: 'FREE' },
  ]);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.max(...users.map(u => u.id), 0) + 1,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: number, updatedUser: Omit<User, 'id'>) => {
    setUsers(users.map(user => (user.id === id ? { ...updatedUser, id } : user)));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};