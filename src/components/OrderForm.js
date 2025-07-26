import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function OrderForm({ vendorId, supplierId }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), where("supplierId", "==", supplierId));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [supplierId]);

  const handleOrder = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    await addDoc(collection(db, "orders"), {
      vendorId, supplierId,
      productId,
      productName: product.name,
      quantity: Number(quantity)
    });
    setProductId(""); setQuantity(1);
    alert("Order placed!");
  };

  return (
    <form onSubmit={handleOrder}>
      <h3>Place Order</h3>
      <select value={productId} onChange={e => setProductId(e.target.value)}>
        <option value="">Select product</option>
        {products.map(p => (
          <option value={p.id} key={p.id}>{p.name} - ₹{p.price}</option>
        ))}
      </select>
      <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button type="submit">Order</button>
    </form>
  );
}