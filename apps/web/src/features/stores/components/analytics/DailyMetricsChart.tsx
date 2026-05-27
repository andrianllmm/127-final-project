import { useMemo } from 'react';
import { currencyFormatter } from '@/shared/lib/currencyFormatter';
import { Card } from '@/shared/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { DailyMetrics } from '@repo/api';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface DailyMetricsChartProps {
  data: DailyMetrics;
  isLoading?: boolean;
}

export function DailyMetricsChart({ data, isLoading = false }: DailyMetricsChartProps) {
  const chartData = useMemo(
    () => [...data].slice(-30).sort((a, b) => a.date.localeCompare(b.date)),
    [data],
  );

  const chartConfig = {
    orders: {
      label: 'Orders',
      color: 'var(--chart-1)',
    },
  } satisfies import('@/shared/components/ui/chart').ChartConfig;

  const totalOrders = chartData.reduce((sum, day) => sum + day.order_count, 0);

  const totalRevenue = chartData.reduce((sum, day) => sum + Number(day.revenue || 0), 0);

  const averageOrders = chartData.length > 0 ? totalOrders / chartData.length : 0;

  return (
    <Card className="p-6">
      <div className="mb-5 space-y-1">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Daily Order Trends</h3>
        <p className="text-sm text-muted-foreground">
          Orders placed per day for the selected range.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8 text-sm text-muted-foreground">Loading...</div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center py-8 text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <div className="space-y-6">
          <ChartContainer config={chartConfig} className="aspect-[16/9] min-h-[18rem] w-full">
            <BarChart data={chartData} margin={{ left: 4, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={24}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) =>
                  new Date(String(value)).toLocaleDateString('en-PH', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                width={36}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                labelFormatter={(value) =>
                  new Date(String(value)).toLocaleDateString('en-PH', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />

              <Bar dataKey="order_count" fill="var(--color-orders)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {totalOrders.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Average Orders / Day</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {averageOrders.toFixed(1)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Revenue in Range</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {currencyFormatter.format(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
