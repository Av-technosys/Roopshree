import { fetchSubscriptions } from "@/repositories/subscriptions.repository";
import { ExportSubscriptionsButton } from "@/components/admin/ExportSubscriptionsButton";

export default async function SubscriptionsPage() {
  const subscriptions = await fetchSubscriptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Newsletter Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and export your newsletter subscribers.
          </p>
        </div>
        <ExportSubscriptionsButton data={subscriptions} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No newsletter subscriptions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium text-right">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
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
