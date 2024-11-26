import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, XAxis, YAxis, Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

interface Request {
  deploymentId: string;
  ip: string;
  method: string;
  url: string;
  userAgent: string;
  referer?: string;
  timestamp: string;
}

interface RequestData {
  requests: Request[];
}
function processDataForChart(requests: Request[]) {
  const timeIntervals = 10;
  const sortedRequests = [...requests].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const startTime = new Date(sortedRequests[0].timestamp).getTime();
  const endTime = new Date(
    sortedRequests[sortedRequests.length - 1].timestamp,
  ).getTime();
  const intervalDuration = (endTime - startTime) / timeIntervals;

  const chartData = Array.from({ length: timeIntervals }, (_, i) => {
    const intervalStart = startTime + i * intervalDuration;
    const intervalEnd = intervalStart + intervalDuration;
    const requestCount = sortedRequests.filter(
      (req) =>
        new Date(req.timestamp).getTime() >= intervalStart &&
        new Date(req.timestamp).getTime() < intervalEnd,
    ).length;
    return {
      time: new Date(intervalStart).toLocaleTimeString(),
      requests: requestCount,
    };
  });
  return chartData;
}
export default function DashboardCard({ data }: { data: RequestData }) {
  const totalRequests = data.requests.length;

  const chartData = processDataForChart(data.requests);
  console.log({chartData})

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Analytics</CardTitle>
            <CardDescription>
              Detailed view of incoming requests to your deployment
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            Total Requests: {totalRequests}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Request Rate Over Time</h3>
          <ChartContainer
            config={{
              requests: {
                label: "Requests",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="requests"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <ScrollArea className="h-[600px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Deployment ID</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead>Referer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.requests.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge
                      variant={
                        request.method === "GET" ? "default" : "destructive"
                      }
                    >
                      {request.method}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="font-mono text-sm max-w-[200px] truncate"
                    title={request.url}
                  >
                    {request.url}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(request.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{request.ip.replace("::ffff:", "")}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {request.deploymentId}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={request.userAgent}
                  >
                    {request.userAgent}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={request.referer}
                  >
                    {request.referer || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
