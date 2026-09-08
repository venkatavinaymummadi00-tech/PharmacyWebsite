import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const addToCart = (medicine, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.medicineId === medicine.id);
      if (existing) {
        return prevCart.map((item) =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          medicineId: medicine.id,
          name: medicine.name,
          genericName: medicine.genericName,
          category: medicine.category,
          price: medicine.sellingPrice,
          prescriptionRequired: medicine.prescriptionRequired,
          maxStock: medicine.currentStock,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (medicineId) => {
    setCart((prevCart) => prevCart.filter((item) => item.medicineId !== medicineId));
  };

  const clearCart = () => {
    setCart([]);
    setPrescriptionFile(null);
  };

  const hasPrescriptionItems = cart.some((item) => item.prescriptionRequired);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% standard tax
  const total = subtotal + tax;

  const placeOrder = async (customerDetails) => {
    if (cart.length === 0) throw new Error('Cart is empty');
    if (hasPrescriptionItems && !prescriptionFile) {
      throw new Error('Please upload a prescription for Rx required medicines before checkout.');
    }

    const orderData = {
      customerName: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      deliveryAddress: customerDetails.address,
      items: cart,
      totalAmount: total,
      prescriptionUploaded: !!prescriptionFile,
      prescriptionFileUrl: prescriptionFile ? URL.createObjectURL(prescriptionFile) : '',
      paymentMethod: customerDetails.paymentMethod || 'Cash on Delivery',
    };

    const res = await api.createOrder(orderData);
    clearCart();
    setIsCartOpen(false);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        prescriptionFile,
        setPrescriptionFile,
        hasPrescriptionItems,
        subtotal,
        tax,
        total,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
