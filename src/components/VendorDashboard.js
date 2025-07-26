import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import ProductList from "./ProductList";
import OrderForm from "./OrderForm";

export default function VendorDashboard({ user }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      // Fetch all supplier users
      const snap = await getDocs(collection(db, "users"));
      const sup = snap.docs
        .filter(d => d.data().role === "supplier")
        .map(d => ({ id: d.id, ...d.data() }));
      setSuppliers(sup);
    };
    fetchSuppliers();
  }, []);

  return (
    <div>
      <h2>Suppliers</h2>
      <ul>
        {suppliers.map(sup => (
          <li key={sup.id}>
            <button onClick={() => setSelectedSupplier(sup)}>{sup.email}</button>
          </li>
        ))}
      </ul>
      {selectedSupplier && (
        <>
          <ProductList supplierId={selectedSupplier.id} />
          <OrderForm vendorId={user.uid} supplierId={selectedSupplier.id} />
        </>
      )}
    </div>
  );
}