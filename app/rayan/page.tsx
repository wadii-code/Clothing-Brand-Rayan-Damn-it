import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import { OrdersDashboard } from "./orders-dashboard";
import { PasswordGate } from "./password-gate";

export const dynamic = "force-dynamic";

export default async function RayanPage() {
  if (!(await isAdmin())) {
    const hint =
      process.env.NODE_ENV !== "production" && !isAdminConfigured()
        ? "ADMIN_PASSWORD is not set in .env.local — login is disabled until you add it."
        : null;
    return <PasswordGate hint={hint} />;
  }

  const { orders, error } = await getOrders();
  return <OrdersDashboard orders={orders} error={error} />;
}
