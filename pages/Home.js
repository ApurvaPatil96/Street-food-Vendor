import React from "react";
import VendorDashboard from "./components/VendorDashboard";
import SupplierDashboard from "./components/SupplierDashboard";

export default function Home({ user, role }) {
  if (!user) return <div>Login required.</div>;
  if (role === "vendor") return <VendorDashboard user={user} />;
  if (role === "supplier") return <SupplierDashboard user={user} />;
  return <div>Invalid role.</div>;
}