import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  PHARMACIST: 'Pharmacist',
  CUSTOMER: 'Customer',
};

const MOCK_USERS = {
  [ROLES.SUPER_ADMIN]: {
    id: 'USR-001',
    name: 'Eleanor Vance (Super Admin)',
    email: 'admin@pharmacy.com',
    role: ROLES.SUPER_ADMIN,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  [ROLES.PHARMACIST]: {
    id: 'USR-002',
    name: 'Pharm. Marcus Brody',
    email: 'pharmacist@pharmacy.com',
    role: ROLES.PHARMACIST,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
  },
  [ROLES.CUSTOMER]: {
    id: 'USR-003',
    name: 'Sarah Jenkins (Customer)',
    email: 'customer@pharmacy.com',
    role: ROLES.CUSTOMER,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
};

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.SUPER_ADMIN);
  const [user, setUser] = useState(MOCK_USERS[ROLES.SUPER_ADMIN]);

  const switchRole = (role) => {
    if (MOCK_USERS[role]) {
      setCurrentRole(role);
      setUser(MOCK_USERS[role]);
    }
  };

  const isSuperAdmin = currentRole === ROLES.SUPER_ADMIN;
  const isPharmacist = currentRole === ROLES.PHARMACIST || currentRole === ROLES.SUPER_ADMIN;
  const isCustomer = currentRole === ROLES.CUSTOMER;

  return (
    <AuthContext.Provider value={{ currentRole, user, switchRole, isSuperAdmin, isPharmacist, isCustomer, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
