import { currencyFormatter } from '@/shared/lib/currencyFormatter';
import { Card } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { TopItems } from '@repo/api';

interface TopItemsTableProps {
  items: TopItems;
  isLoading?: boolean;
}

export function TopItemsTable({ items, isLoading = false }: TopItemsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Top Performing Items
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Items ranked by quantity sold in the selected date range.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center px-6 py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center px-6 py-8">
          <div className="text-sm text-muted-foreground">No data available</div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.store_item_id}>
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.total_quantity_sold.toLocaleString()}
                </TableCell>
                <TableCell className="text-foreground">
                  {currencyFormatter.format(Number(item.total_revenue) || 0)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.order_count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
