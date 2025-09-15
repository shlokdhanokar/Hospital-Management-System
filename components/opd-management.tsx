"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Clock, User, Plus, Search, Filter, Eye, Edit, Trash2, Activity, Calendar, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingCard } from "./loading-spinner"

interface OPDPatient {
  id: string
  name: string
  age: number
  contact: string
  issue: string
  doctor: string
  appointment_time: string
  status: "waiting" | "in_consultation" | "completed" | "cancelled"
  queue_number: number
  notes?: string
  created_at: string
}

export function OPDManagement() {
  const [patients, setPatients] = useState<OPDPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<OPDPatient | null>(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [showEditPatient, setShowEditPatient] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    fetchPatients()
    // Set up real-time subscription
    const subscription = supabase
      .channel("opd_patients_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "opd_patients" }, () => {
        fetchPatients()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase.from("opd_patients").select("*").order("queue_number", { ascending: true })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error("Error fetching OPD patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_consultation":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("opd_patients").update({ status: newStatus }).eq("id", patientId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Patient status updated to ${newStatus.replace("_", " ")}`,
      })
    } catch (error) {
      console.error("Error updating patient status:", error)
      toast({
        title: "Error",
        description: "Failed to update patient status",
        variant: "destructive",
      })
    }
  }

  const deletePatient = async (patientId: string) => {
    try {
      const { error } = await supabase.from("opd_patients").delete().eq("id", patientId)

      if (error) throw error

      toast({
        title: "Patient Removed",
        description: "Patient has been removed from the queue",
      })
    } catch (error) {
      console.error("Error deleting patient:", error)
      toast({
        title: "Error",
        description: "Failed to remove patient",
        variant: "destructive",
      })
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm) ||
      patient.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getQueueStats = () => {
    const waiting = patients.filter((p) => p.status === "waiting").length
    const inConsultation = patients.filter((p) => p.status === "in_consultation").length
    const completed = patients.filter((p) => p.status === "completed").length
    const total = patients.length
    return { waiting, inConsultation, completed, total }
  }

  const stats = getQueueStats()

  if (loading) {
    return <LoadingCard title="Loading OPD patients..." description="Please wait while we fetch the patient queue" />
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.waiting}</p>
                <p className="text-sm text-muted-foreground">Waiting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inConsultation}</p>
                <p className="text-sm text-muted-foreground">In Consultation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
              <SelectItem value="in_consultation">In Consultation</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New OPD Patient</DialogTitle>
            </DialogHeader>
            <AddOPDPatientForm
              onSuccess={() => {
                setShowAddPatient(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Patient Queue */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">#{patient.queue_number}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{patient.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Age: {patient.age}</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.contact}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Issue: {patient.issue}</p>
                    <p className="text-sm text-muted-foreground">Doctor: {patient.doctor}</p>
                    {patient.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {patient.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{patient.appointment_time}</p>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setShowPatientDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(patient)
                        setShowEditPatient(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    {patient.status === "waiting" && (
                      <Button size="sm" onClick={() => updatePatientStatus(patient.id, "in_consultation")}>
                        Start Consultation
                      </Button>
                    )}

                    {patient.status === "in_consultation" && (
                      <Button size="sm" variant="outline" onClick={() => updatePatientStatus(patient.id, "completed")}>
                        Mark Complete
                      </Button>
                    )}

                    <Button size="sm" variant="destructive" onClick={() => deletePatient(patient.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No patients found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first OPD patient to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && <PatientDetailsView patient={selectedPatient} />}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={showEditPatient} onOpenChange={setShowEditPatient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <EditOPDPatientForm
              patient={selectedPatient}
              onSuccess={() => {
                setShowEditPatient(false)
                setSelectedPatient(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddOPDPatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    issue: "",
    doctor: "",
    appointment_time: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get next queue number
      const { data: lastPatient } = await supabase
        .from("opd_patients")
        .select("queue_number")
        .order("queue_number", { ascending: false })
        .limit(1)
        .single()

      const nextQueueNumber = (lastPatient?.queue_number || 0) + 1

      const { error } = await supabase.from("opd_patients").insert({
        ...formData,
        age: Number.parseInt(formData.age),
        queue_number: nextQueueNumber,
        status: "waiting",
      })

      if (error) throw error

      toast({
        title: "Patient Added",
        description: `${formData.name} has been added to the queue`,
      })

      onSuccess()
    } catch (error) {
      console.error("Error adding patient:", error)
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Patient Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact">Contact Number</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="issue">Medical Issue</Label>
        <Input
          id="issue"
          value={formData.issue}
          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="doctor">Assigned Doctor</Label>
        <Input
          id="doctor"
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="appointment_time">Appointment Time</Label>
        <Input
          id="appointment_time"
          type="time"
          value={formData.appointment_time}
          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or special instructions..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Patient"}
      </Button>
    </form>
  )
}

function EditOPDPatientForm({ patient, onSuccess }: { patient: OPDPatient; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: patient.name,
    age: patient.age.toString(),
    contact: patient.contact,
    issue: patient.issue,
    doctor: patient.doctor,
    appointment_time: patient.appointment_time,
    notes: patient.notes || "",
    status: patient.status,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("opd_patients")
        .update({
          ...formData,
          age: Number.parseInt(formData.age),
        })
        .eq("id", patient.id)

      if (error) throw error

      toast({
        title: "Patient Updated",
        description: `${formData.name}'s information has been updated`,
      })

      onSuccess()
    } catch (error) {
      console.error("Error updating patient:", error)
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Patient Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-age">Age</Label>
          <Input
            id="edit-age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-contact">Contact Number</Label>
        <Input
          id="edit-contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-issue">Medical Issue</Label>
        <Input
          id="edit-issue"
          value={formData.issue}
          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-doctor">Assigned Doctor</Label>
        <Input
          id="edit-doctor"
          value={formData.doctor}
          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-appointment_time">Appointment Time</Label>
        <Input
          id="edit-appointment_time"
          type="time"
          value={formData.appointment_time}
          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="in_consultation">In Consultation</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-notes">Additional Notes</Label>
        <Textarea
          id="edit-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or special instructions..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Patient"}
      </Button>
    </form>
  )
}

function PatientDetailsView({ patient }: { patient: OPDPatient }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Name</Label>
          <p className="text-foreground">{patient.name}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Age</Label>
          <p className="text-foreground">{patient.age} years</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
          <p className="text-foreground">{patient.contact}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Queue Number</Label>
          <p className="text-foreground">#{patient.queue_number}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Appointment Time</Label>
          <p className="text-foreground">{patient.appointment_time}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
          <Badge
            className={`${
              patient.status === "waiting"
                ? "bg-yellow-100 text-yellow-800"
                : patient.status === "in_consultation"
                  ? "bg-blue-100 text-blue-800"
                  : patient.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
          >
            {patient.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-muted-foreground">Medical Issue</Label>
        <p className="text-foreground">{patient.issue}</p>
      </div>

      <div>
        <Label className="text-sm font-medium text-muted-foreground">Assigned Doctor</Label>
        <p className="text-foreground">{patient.doctor}</p>
      </div>

      {patient.notes && (
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
          <p className="text-foreground">{patient.notes}</p>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium text-muted-foreground">Registration Time</Label>
        <p className="text-foreground">{new Date(patient.created_at).toLocaleString()}</p>
      </div>
    </div>
  )
}
