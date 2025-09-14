"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Heart, Stethoscope, Pill, Phone, UserCheck, Clock } from "lucide-react"

interface Patient {
  id: string
  name: string
  date_of_birth: string
  blood_group: string
  issue: string
  recovery_rate: number
  expected_discharge_date: string
  doctor: string
  medicines: string
  caretaker_name: string
  caretaker_contact: string
  admission_date: string
  bed_id: string
}

interface PatientInfoDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientInfoDialog({ patient, open, onOpenChange }: PatientInfoDialogProps) {
  if (!patient) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRecoveryColor = (rate: number) => {
    if (rate >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (rate >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Patient Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name</label>
                  <p className="text-lg font-semibold text-slate-800">{patient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Age</label>
                  <p className="text-lg font-semibold text-slate-800">{calculateAge(patient.date_of_birth)} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                  <p className="text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(patient.date_of_birth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Blood Group</label>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <Heart className="w-3 h-3 mr-1" />
                    {patient.blood_group}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Medical Issue</label>
                <p className="text-slate-800 font-medium">{patient.issue}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Attending Doctor</label>
                <p className="text-slate-800 font-medium">{patient.doctor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Current Medicines</label>
                <p className="text-slate-800 flex items-start gap-2">
                  <Pill className="w-4 h-4 mt-0.5 text-blue-600" />
                  {patient.medicines || "No medicines prescribed"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Recovery Rate</label>
                <div className="flex items-center gap-3">
                  <Badge className={getRecoveryColor(patient.recovery_rate)}>{patient.recovery_rate}%</Badge>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${patient.recovery_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admission & Discharge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Admission & Discharge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Admission Date</label>
                  <p className="text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    {formatDate(patient.admission_date)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Expected Discharge</label>
                  <p className="text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {patient.expected_discharge_date ? formatDate(patient.expected_discharge_date) : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Caretaker Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Caretaker Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Caretaker Name</label>
                  <p className="text-slate-800 font-medium">{patient.caretaker_name || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Contact Number</label>
                  <p className="text-slate-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    {patient.caretaker_contact || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
