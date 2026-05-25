import {
  DashboardCard,
  Field,
  PrimaryAction,
} from "@/components/dashboard/DashboardPrimitives"

export function AddressEditPage() {
  return (
    <DashboardCard className="p-5 sm:p-6">
      <h1 className="text-base font-semibold text-black">Edit Address</h1>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="Full Name" defaultValue="Sarah Johnson" />
        <Field label="Phone no." defaultValue="+91 XXXXXXXXX59" />
        <Field
          label="Address / Street"
          defaultValue="123 Wellness Street, Apt 4B"
          className="md:col-span-2"
        />
        <Field
          label="Locality"
          defaultValue="Downtown"
          className="md:col-span-2"
        />
        <Field label="City" defaultValue="Jaipur" />
        <Field label="State" defaultValue="Rajasthan" />
        <Field label="Pincode" defaultValue="302019" />
        <Field label="Country" defaultValue="India" className="md:col-span-2" />
      </div>

      <label className="mt-6 flex items-center gap-2 text-sm text-black">
        <input
          type="checkbox"
          className="size-4 border border-[#e1c5a5] accent-[#C39150]"
        />
        Set as default shipping address
      </label>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <PrimaryAction>Update</PrimaryAction>
        <button
          type="button"
          className="h-10 border border-[#C39150] text-xs font-semibold tracking-[0.08em] text-[#C39150] transition hover:bg-[#fbf3ea]"
        >
          Cancel
        </button>
      </div>
    </DashboardCard>
  )
}
