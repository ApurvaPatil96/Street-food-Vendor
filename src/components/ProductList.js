import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProductList({ supplierId }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), where("supplierId", "==", supplierId));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [supplierId]);
  
  return (
    <div>
      <h3>Products</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  );
}