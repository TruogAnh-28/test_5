import {
  format,
} from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,

  Legend,
} from "recharts"

import {
  moneyFormat,
} from "~/shared/utils/shared"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/shared/components/ui/chart"

interface BarChartComponentProps {
  title: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  config: ChartConfig
  dataKeys: string[] // Danh sách các cột trên trục Y
  xAxisKey: string
}

export function BarChartComponent({
  title,
  description,
  data,
  config,
  dataKeys,
  xAxisKey,
}: BarChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="overflow-y-visible">
        <ChartContainer config={config}>
          <BarChart
            height={400}
            data={data}
            margin={
              {
                top: 20,
                right: 40,
                bottom: 5,
                left: 20,
              }
            }
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={
                value => format(
                  value, "dd/MM"
                )
              }
            />

            {/* Trục Y bên trái cho total_orders */}
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            {/* Trục Y bên phải cho total_revenue */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={value => String(moneyFormat(value))}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* Hiển thị các Bar riêng biệt theo yAxisId */}
            {
              dataKeys.map(key => (
                <Bar
                  key={key}
                  dataKey={key}
                  yAxisId={key === "total_revenue" ? "right" : "left"}
                  fill={config[key]?.color || "#8884d8"}
                  radius={8}
                >
                  <LabelList
                    dataKey={key}
                    position="top"
                    fontSize={12}
                    fill="#000000"
                    offset={10}
                  />
                </Bar>
              ))
            }

            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
