import AdminLayout from "@/app/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 text-white border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Overview of recent phrases, videos, and upload statuses will appear here.</p>
            {/* Placeholder for dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Total Phrases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">1234</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Videos Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">567</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Pending Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">12</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
