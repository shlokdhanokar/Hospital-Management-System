"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Bed, CreditCard, Calendar, Download, FileText, Activity, DollarSign } from "lucide-react"

interface ReportData {
  admissions: number
  discharges: number
  revenue: number
  occupancyRate: number
  averageStay: number
  pendingPayments: number
}

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [reportData, setReportData] = useState<ReportData>({
    admissions: 45,
    discharges: 38,
    revenue: 1250000,
    occupancyRate: 78,
    averageStay: 5.2,
    pendingPayments: 125000,
  })

  // Mock data for charts
  const monthlyAdmissions = [
    { month: "Jan", admissions: 32, discharges: 28, revenue: 980000 },
    { month: "Feb", admissions: 41, discharges: 35, revenue: 1150000 },
    { month: "Mar", admissions: 38, discharges: 42, revenue: 1320000 },
    { month: "Apr", admissions: 45, discharges: 38, revenue: 1250000 },
  ]

  const departmentData = [
    { name: "General Medicine", patients: 35, color: "#15803d" },
    { name: "Surgery", patients: 28, color: "#84cc16" },
    { name: "Cardiology", patients: 22, color: "#1d4ed8" },
    { name: "Orthopedics", patients: 18, color: "#d97706" },
    { name: "Pediatrics", patients: 15, color: "#9333ea" },
  ]

  const bedOccupancyData = [
    { day: "Mon", occupied: 45, total: 60 },
    { day: "Tue", occupied: 48, total: 60 },
    { day: "Wed", occupied: 52, total: 60 },
    { day: "Thu", occupied: 47, total: 60 },
    { day: "Fri", occupied: 44, total: 60 },
    { day: "Sat", occupied: 41, total: 60 },
    { day: "Sun", occupied: 38, total: 60 },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="medical-spacing-md">
      {/* Header with Period Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Hospital Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into hospital operations and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 medical-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Admissions</p>
                <p className="text-2xl font-bold text-foreground">{reportData.admissions}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Discharges</p>
                <p className="text-2xl font-bold text-foreground">{reportData.discharges}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(reportData.revenue)}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bed Occupancy</p>
                <p className="text-2xl font-bold text-foreground">{reportData.occupancyRate}%</p>
                <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3" />
                  -3% from last month
                </p>
              </div>
              <Bed className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Stay (Days)</p>
                <p className="text-2xl font-bold text-foreground">{reportData.averageStay}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Optimal range
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.pendingPayments)}</p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Needs attention
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart className="w-6 h-6 text-primary" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="medical-spacing-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyAdmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="admissions" fill="#15803d" name="Admissions" />
                <Bar dataKey="discharges" fill="#84cc16" name="Discharges" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PieChart className="w-6 h-6 text-primary" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="medical-spacing-sm">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="patients"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="medical-spacing-sm">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAdmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#15803d"
                  strokeWidth={3}
                  dot={{ fill: "#15803d", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bed Occupancy */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Bed className="w-6 h-6 text-primary" />
              Weekly Bed Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="medical-spacing-sm">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="occupied" fill="#15803d" name="Occupied Beds" />
                <Bar dataKey="total" fill="#e5e7eb" name="Total Beds" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="medical-card mt-8">
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
        </CardHeader>
        <CardContent className="medical-spacing-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Monthly Report</p>
                <p className="text-sm text-muted-foreground">Generate comprehensive monthly report</p>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Financial Summary</p>
                <p className="text-sm text-muted-foreground">Export financial data and analytics</p>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 bg-transparent">
              <Users className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Patient Statistics</p>
                <p className="text-sm text-muted-foreground">Detailed patient admission reports</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
