import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  PHARMACIST: 'Pharmacist',
  CUSTOMER: 'Customer',
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(ROLES.SUPER_ADMIN);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  // Derived user object shaped like the rest of the app expects
  const user = firebaseUser
    ? {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        role: currentRole,
        avatar:
          firebaseUser.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            firebaseUser.displayName || firebaseUser.email
          )}&background=0ea5e9&color=fff`,
      }
    : null;

  // ── Auth Actions ──────────────────────────────────────────────
  const login = async (email, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError(getFriendlyError(err.code));
      throw err;
    }
  };

  const signup = async (email, password, displayName = '') => {
    setAuthError(null);
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(newUser, { displayName });
      }
    } catch (err) {
      setAuthError(getFriendlyError(err.code));
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentRole(ROLES.SUPER_ADMIN);
  };

  // ── Role Switcher (keeps existing permission system working) ──
  const switchRole = (role) => {
    if (Object.values(ROLES).includes(role)) {
      setCurrentRole(role);
    }
  };

  const isSuperAdmin = currentRole === ROLES.SUPER_ADMIN;
  const isPharmacist = currentRole === ROLES.PHARMACIST || currentRole === ROLES.SUPER_ADMIN;
  const isCustomer = currentRole === ROLES.CUSTOMER;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        currentRole,
        loading,
        authError,
        setAuthError,
        login,
        signup,
        logout,
        switchRole,
        isSuperAdmin,
        isPharmacist,
        isCustomer,
        ROLES,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ── Helper: turn Firebase error codes into friendly messages ──
function getFriendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
