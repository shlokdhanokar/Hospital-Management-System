"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  FileText,
  CreditCard,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingCard } from "./loading-spinner"

interface DischargedPatient {
  id: string
  name: string
  date_of_birth: string
  blood_group: string
  phone: string
  address: string
  issue: string
  doctor: string
  admission_date: string
  discharge_date: string
  total_amount: number
  paid_amount: number
  payment_status: "paid" | "pending" | "partial"
  bed_number: number
  emergency_contact_name: string
  emergency_contact_phone: string
}

interface PaymentStatusUpdate {
  patientId: string
  paidAmount: number
  paymentStatus: "paid" | "pending" | "partial"
}

export function DischargedPatients() {
  const [patients, setPatients] = useState<DischargedPatient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<DischargedPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedPatient, setSelectedPatient] = useState<DischargedPatient | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchDischargedPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, paymentFilter, dateFilter])

  const fetchDischargedPatients = async () => {
    try {
      // This would typically fetch from a discharged_patients table
      // For now, we'll simulate with mock data
      const mockData: DischargedPatient[] = [
        {
          id: "1",
          name: "John Doe",
          date_of_birth: "1985-06-15",
          blood_group: "O+",
          phone: "+91 9876543210",
          address: "123 Main Street, Mumbai, Maharashtra 400001",
          issue: "Chest pain and shortness of breath",
          doctor: "Dr. Smith",
          admission_date: "2024-01-15T10:00:00Z",
          discharge_date: "2024-01-22T14:30:00Z",
          total_amount: 45000,
          paid_amount: 45000,
          payment_status: "paid",
          bed_number: 101,
          emergency_contact_name: "Jane Doe",
          emergency_contact_phone: "+91 9876543211",
        },
        {
          id: "2",
          name: "Priya Sharma",
          date_of_birth: "1990-03-22",
          blood_group: "A+",
          phone: "+91 9876543212",
          address: "456 Park Avenue, Delhi, Delhi 110001",
          issue: "Appendicitis surgery",
          doctor: "Dr. Patel",
          admission_date: "2024-01-18T08:00:00Z",
          discharge_date: "2024-01-25T12:00:00Z",
          total_amount: 75000,
          paid_amount: 50000,
          payment_status: "partial",
          bed_number: 102,
          emergency_contact_name: "Raj Sharma",
          emergency_contact_phone: "+91 9876543213",
        },
        {
          id: "3",
          name: "Mohammed Ali",
          date_of_birth: "1978-11-08",
          blood_group: "B+",
          phone: "+91 9876543214",
          address: "789 Garden Road, Bangalore, Karnataka 560001",
          issue: "Diabetes management",
          doctor: "Dr. Kumar",
          admission_date: "2024-01-20T16:00:00Z",
          discharge_date: "2024-01-27T10:00:00Z",
          total_amount: 32000,
          paid_amount: 0,
          payment_status: "pending",
          bed_number: 103,
          emergency_contact_name: "Fatima Ali",
          emergency_contact_phone: "+91 9876543215",
        },
      ]

      setPatients(mockData)
    } catch (error) {
      console.error("Error fetching discharged patients:", error)
      toast({
        title: "Error",
        description: "Failed to fetch discharged patients",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm) ||
          patient.bed_number.toString().includes(searchTerm),
      )
    }

    // Payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((patient) => patient.payment_status === paymentFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((patient) => new Date(patient.discharge_date) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((patient) => new Date(patient.discharge_date) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((patient) => new Date(patient.discharge_date) >= filterDate)
          break
      }
    }

    setFilteredPatients(filtered)
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partial</Badge>
      case "pending":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "partial":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "pending":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const updatePaymentStatus = async (
    patientId: string,
    paidAmount: number,
    paymentStatus: "paid" | "pending" | "partial",
  ) => {
    try {
      // Update the patient's payment status
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === patientId ? { ...patient, paid_amount: paidAmount, payment_status: paymentStatus } : patient,
        ),
      )

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      })
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <LoadingCard
        title="Loading discharged patients..."
        description="Please wait while we fetch the patient records"
      />
    )
  }

  return (
    <div className="medical-spacing-md">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Discharged</p>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
              </div>
              <User className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payments Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {patients.filter((p) => p.payment_status === "pending").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Partial Payments</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {patients.filter((p) => p.payment_status === "partial").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardContent className="medical-spacing-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(patients.reduce((sum, p) => sum + p.paid_amount, 0))}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="medical-card mb-6">
        <CardContent className="medical-spacing-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or bed number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 medical-input"
                />
              </div>
            </div>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-48 medical-input">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48 medical-input">
                <SelectValue placeholder="Discharge Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Discharged Patients ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="medical-spacing-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Details</TableHead>
                  <TableHead>Medical Info</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground medical-text-container">{patient.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="medical-text-container">Bed {patient.bed_number}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium medical-text-container">{patient.issue}</p>
                        <p className="text-sm text-muted-foreground">{patient.doctor}</p>
                        <Badge variant="outline" className="text-xs">
                          {patient.blood_group}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>Admitted: {formatDate(patient.admission_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>Discharged: {formatDate(patient.discharge_date)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(patient.payment_status)}
                        {getPaymentStatusBadge(patient.payment_status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">
                          {formatCurrency(patient.paid_amount)} / {formatCurrency(patient.total_amount)}
                        </p>
                        {patient.payment_status !== "paid" && (
                          <p className="text-sm text-red-600">
                            Due: {formatCurrency(patient.total_amount - patient.paid_amount)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedPatient(patient)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Generate and download bill
                            toast({
                              title: "Downloading Bill",
                              description: "Bill is being generated...",
                            })
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Bill
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">No Discharged Patients Found</p>
                <p className="text-muted-foreground">
                  {searchTerm || paymentFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No patients have been discharged yet."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="medical-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Patient Details - {selectedPatient.name}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="medical-spacing-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="font-semibold medical-text-container">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p className="font-semibold">{formatDate(selectedPatient.date_of_birth)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                    <p className="font-semibold">{selectedPatient.blood_group}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="font-semibold medical-text-container">{selectedPatient.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical Issue</p>
                    <p className="font-semibold medical-text-container">{selectedPatient.issue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attending Doctor</p>
                    <p className="font-semibold">{selectedPatient.doctor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bed Number</p>
                    <p className="font-semibold">Bed {selectedPatient.bed_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                    <p className="font-semibold medical-text-container">{selectedPatient.emergency_contact_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPatient.emergency_contact_phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(selectedPatient.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedPatient.paid_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(selectedPatient.total_amount - selectedPatient.paid_amount)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  {getPaymentStatusBadge(selectedPatient.payment_status)}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Downloading Bill",
                      description: "Patient bill is being generated...",
                    })
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Bill
                </Button>
                {selectedPatient.payment_status !== "paid" && (
                  <Button
                    className="medical-button-primary"
                    onClick={() => {
                      updatePaymentStatus(selectedPatient.id, selectedPatient.total_amount, "paid")
                      setSelectedPatient({
                        ...selectedPatient,
                        paid_amount: selectedPatient.total_amount,
                        payment_status: "paid",
                      })
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
