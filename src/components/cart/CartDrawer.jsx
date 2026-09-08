import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, X, Trash2, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    tax,
    total,
    prescriptionFile,
    setPrescriptionFile,
    hasPrescriptionItems,
    placeOrder,
  } = useCart();

  const [customerDetails, setCustomerDetails] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+91 98765 43210',
    address: '404 Oakwood Avenue, Suite 12B',
    paymentMethod: 'Cash on Delivery',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!isCartOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setSubmitting(true);
      const newOrder = await placeOrder(customerDetails);
      setOrderSuccess(newOrder);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-sm">Pharmacy Customer Order ({cart.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderSuccess ? (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-600">
                Order ID: <strong className="text-slate-900 font-mono">{orderSuccess.id}</strong>
              </p>
              {orderSuccess.prescriptionUploaded && (
                <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs">
                  <strong>Prescription Status:</strong> Pending Verification by Pharmacist Staff before dispatch.
                </div>
              )}
              <p className="text-xs text-slate-500">
                Thank you for choosing PharmaCare. You can track your order status in the Customer Orders section.
              </p>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setIsCartOpen(false);
                }}
                className="px-6 py-2.5 bg-pharmacy-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs">Browse medicines and add items to your cart.</p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.medicineId} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          {item.name}
                          {item.prescriptionRequired && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-indigo-100 text-indigo-700 font-bold rounded">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">₹{item.price.toFixed(2)} / unit</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.medicineId)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Prescription Upload Section */}
              {hasPrescriptionItems && cart.length > 0 && (
                <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" /> Upload Doctor's Prescription (Required)
                  </div>
                  <p className="text-[11px] text-indigo-700">
                    Your cart includes prescription (Rx) required medicines. Please upload a clear photo of your prescription.
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  {prescriptionFile && (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> File attached: {prescriptionFile.name}
                    </div>
                  )}
                </div>
              )}

              {/* Checkout Form */}
              {cart.length > 0 && (
                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="font-bold text-slate-800 text-sm">Delivery & Customer Details</div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                      <input
                        type="text"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Payment</label>
                      <select
                        value={customerDetails.paymentMethod}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, paymentMethod: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      >
                        <option value="Cash on Delivery">Cash on Delivery</option>
                        <option value="UPI / GPay / PhonePe">UPI / Online</option>
                        <option value="Credit Card">Credit Card</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Delivery Address</label>
                    <textarea
                      rows={2}
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Summary Totals */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated GST (5%):</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Amount:</span>
                      <span className="text-pharmacy-700">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Processing Order...' : 'Place Pharmacy Order'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
