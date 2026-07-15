import { fetchSubscriptions } from "@/repositories/subscriptions.repository";
import { ExportSubscriptionsButton } from "@/components/admin/ExportSubscriptionsButton";

export default async function SubscriptionsPage() {
  const subscriptions = await fetchSubscriptions();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Newsletter Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and export your newsletter subscribers.
          </p>
        </div>
        <ExportSubscriptionsButton data={subscriptions} />
      </div>

      <div className="overflow-hidden rounded-md border bg-white">
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No newsletter subscriptions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium text-right">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right font-medium">
                      {sub.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
