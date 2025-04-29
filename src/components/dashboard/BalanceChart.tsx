
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

const data = [
  { name: "Jan", Income: 4000, Expenses: 2400, Balance: 1600 },
  { name: "Feb", Income: 4200, Expenses: 2800, Balance: 1400 },
  { name: "Mar", Income: 5000, Expenses: 3000, Balance: 2000 },
  { name: "Apr", Income: 4800, Expenses: 3200, Balance: 1600 },
  { name: "May", Income: 5500, Expenses: 3800, Balance: 1700 },
  { name: "Jun", Income: 6000, Expenses: 4000, Balance: 2000 },
  { name: "Jul", Income: 6200, Expenses: 4300, Balance: 1900 },
  { name: "Aug", Income: 6500, Expenses: 4500, Balance: 2000 },
  { name: "Sep", Income: 7000, Expenses: 5000, Balance: 2000 },
  { name: "Oct", Income: 7200, Expenses: 5200, Balance: 2000 },
  { name: "Nov", Income: 7500, Expenses: 5500, Balance: 2000 },
  { name: "Dec", Income: 8000, Expenses: 6000, Balance: 2000 },
];

export function BalanceChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="#10b981"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Balance"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
