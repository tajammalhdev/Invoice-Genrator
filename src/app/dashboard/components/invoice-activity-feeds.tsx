import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconFileInvoice,
  IconCash,
  IconAlertTriangle,
  IconUserPlus,
  IconMail,
} from "@tabler/icons-react"

const activities = [
  {
    icon: <IconCash className="h-5 w-5 text-green-500" />,
    title: "Invoice #1277 marked as paid",
    description: "$1,200 from John Doe",
    time: "2h ago",
  },
  {
    icon: <IconFileInvoice className="h-5 w-5 text-blue-500" />,
    title: "Invoice #1289 created",
    description: "For Acme Corp",
    time: "4h ago",
  },
  {
    icon: <IconAlertTriangle className="h-5 w-5 text-red-500" />,
    title: "Invoice #1265 overdue",
    description: "5 days past due",
    time: "1d ago",
  },
  {
    icon: <IconUserPlus className="h-5 w-5 text-purple-500" />,
    title: "New customer added",
    description: "Jane Smith",
    time: "2d ago",
  },
  {
    icon: <IconMail className="h-5 w-5 text-yellow-500" />,
    title: "Invoice #1288 sent",
    description: "Sent to client@example.com",
    time: "3d ago",
  },
]

export function RecentActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="align-top">
                    <div className="mt-1">{activity.icon}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {activity.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.description}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {activity.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
