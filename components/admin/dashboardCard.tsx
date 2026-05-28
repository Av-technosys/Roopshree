// components/dashboard-cards.tsx
import { ShoppingCart, Package, Users, DollarSign } from "lucide-react"
import { StatCard } from "./statCard"
import { getProductsCount } from "@/helper/product/action"

export async function DashboardCards() {

  const totalProducts = await getProductsCount(); // ✅ add

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders" 
        value="1,247" 
        subtitle="+8.5% from last week ↑" 
        subtitleVariant="positive"
        icon={<ShoppingCart className="text-sky-500" size={24} />}
        iconBg="bg-sky-100/50"
      />
      <StatCard 
        title="Total Products" 
        value={totalProducts.toString()} // ✅ change
        subtitle="78 Active Products" 
        icon={<Package className="text-purple-500" size={24} />}
        iconBg="bg-purple-100/50"
      />
      <StatCard 
        title="Total Users" 
        value="89" 
        subtitle="76 Active Products" 
        icon={<Users className="text-yellow-500" size={24} />}
        iconBg="bg-yellow-100/50"
      />
      <StatCard 
        title="Total Revenue" 
        value="$125" 
        subtitle="76 Active Products" 
        icon={<DollarSign className="text-emerald-500" size={24} />}
        iconBg="bg-emerald-100/50"
      />
    </div>
  )
}