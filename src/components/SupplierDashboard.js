import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function SupplierDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), where("supplierId", "==", user.uid));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [user.uid]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      supplierId: user.uid,
      name,
      price: Number(price)
    });
    setName(""); setPrice("");
    window.location.reload(); // Quick reload for demo. You can refactor for better state update.
  };

  return (
    <div>
      <h2>Your Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
      <form onSubmit={handleAddProduct}>
        <input placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <button>Add Product</button>
      </form>
      <SupplierOrders supplierId={user.uid} />
    </div>
  );
}

// Order viewer
function SupplierOrders({ supplierId }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("supplierId", "==", supplierId));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => doc.data()));
    };
    fetchOrders();
  }, [supplierId]);
  return (
    <div>
      <h3>Orders Received</h3>
      <ul>
        {orders.map((o, i) => (
          <li key={i}>{o.vendorId} ordered {o.productName} (x{o.quantity})</li>
        ))}
      </ul>
    </div>
  );
}