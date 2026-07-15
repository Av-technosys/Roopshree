import {
  Bell,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Package,
  Star,
  User,
} from "lucide-react"

export const dashboardNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  { label: "My Orders", href: "/dashboard/orders", icon: Package },
  { label: "Address Book", href: "/dashboard/address-book", icon: MapPin },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Reviews & Ratings", href: "/dashboard/reviews", icon: Star },
  // { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

export const signOutItem = {
  label: "Sign Out",
  href: "/auth",
  icon: LogOut,
}

export const overviewStats = [
  { label: "Orders", value: "0", icon: Package, href: "/dashboard/orders" },
  { label: "Addresses", value: "0", icon: MapPin, href: "/dashboard/address-book" },
  { label: "Wishlist", value: "0", icon: Heart, href: "/dashboard/wishlist" },
  { label: "Reviews", value: "0", icon: Star, href: "/dashboard/reviews" },
]

export const recentOrders = [
  {
    id: "MOR-24-012203",
    slug: "MOR-24-012203",
    date: "28 Feb, 2024",
    total: "₹23,250",
    status: "In Transit",
    statusTone: "blue",
    product: "Lagdi Patta Saree",
    colour: "Red",
    quantity: 2,
    image: "/home/new-arrival-model.png",
  },
  {
    id: "MOR-24-012203",
    slug: "MOR-24-012203-delivered",
    date: "28 Feb, 2024",
    total: "₹23,250",
    status: "Delivered",
    statusTone: "green",
    product: "Lagdi Patta Saree",
    colour: "Red",
    quantity: 2,
    image: "/home/new-arrival-model.png",
  },
]

export const customer = {
  name: "John Doe",
  email: "johndoe333@gmail.com",
}

export const defaultAddress = {
  name: "John Doe",
  tags: ["Home", "Default"],
  address: "123, palm Residency, Sector 45, Jaipur, Rajasthan, 302022",
}

export const addresses = [
  {
    id: "default",
    name: "Sarah Johnson",
    phone: "+91 XXXXXX6958",
    address: "123 Downtown Street, apt 4B, Jaipur, Rajasthan, 302019",
    isDefault: true,
  },
  {
    id: "secondary",
    name: "Sarah Johnson",
    phone: "+91 XXXXXX6958",
    address: "123 Downtown Street, apt 4B, Jaipur, Rajasthan, 302019",
    isDefault: false,
  },
]

export const orderSummary = [
  { label: "AeroMix Tall Faucet", value: "₹8,500" },
  { label: "Subtotal", value: "₹8,500" },
  { label: "Total", value: "₹8,500", strong: true },
]

export const submittedReview = {
  customer: "John Doe",
  product: "Bandhej Saree",
  colour: "Red",
  rating: 5,
  title: "Excellent quality and finish",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  date: "12 March 2024",
  helpful: 3,
  image: "/home/new-arrival-model.png",
}

export const notifications = [
  {
    id: "orders",
    title: "Order Updates",
    description:
      "Get notified about order status changes, shipping updates, and delivery confirmations.",
    enabled: true,
  },
  {
    id: "promotions",
    title: "Promotions & Offers",
    description: "Receive exclusive deals, seasonal sales, and special discount codes.",
    enabled: false,
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Stay updated with new product launches, design tips, and brand stories.",
    enabled: true,
  },
]
