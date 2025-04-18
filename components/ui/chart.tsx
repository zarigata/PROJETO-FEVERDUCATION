import type React from "react"
export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-lg font-semibold mb-2">{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

export const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-md p-2">
        <p className="font-bold">{`${label}`}</p>
        {payload.map((item: any) => (
          <p key={item.dataKey} className="text-gray-700 dark:text-gray-300">
            {`${item.name}: ${item.value}`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export const ChartLegend = () => {
  return null
}
