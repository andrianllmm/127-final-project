import { Card } from '@/shared/components/ui/card';
import { TopItems } from '@repo/api';

interface TopItemsTableProps {
  items: TopItems;
  isLoading?: boolean;
}

export function TopItemsTable({ items, isLoading = false }: TopItemsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Top Performing Items</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center px-6 py-8">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center px-6 py-8">
          <div className="text-sm text-gray-500">No data available</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Quantity Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.store_item_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.total_quantity_sold}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₱{parseFloat(item.total_revenue).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.order_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
