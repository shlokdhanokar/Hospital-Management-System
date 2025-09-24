"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, Plus, FileText, Heart, Activity, Clock, User } from "lucide-react"
import { PatientInfoDialog } from "./patient-info-dialog"
import { AddExpenseDialog } from "./add-expense-dialog"
import { DischargeSummaryDialog } from "./discharge-summary-dialog"
import { LoadingCard } from "./loading-spinner"

interface Bed {
  id: string
  bed_number: number
  status: "vacant" | "under_maintenance" | "patient_admitted"
}

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

export function BedManagement() {
  const [beds, setBeds] = useState<Bed[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientInfo, setShowPatientInfo] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showDischargeSummary, setShowDischargeSummary] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch beds
      const { data: bedsData, error: bedsError } = await supabase.from("beds").select("*").order("bed_number")

      if (bedsError) throw bedsError

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase.from("patients").select("*")

      if (patientsError) throw patientsError

      setBeds(bedsData || [])
      setPatients(patientsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPatientForBed = (bedId: string) => {
    return patients.find((patient) => patient.bed_id === bedId)
  }

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "vacant":
        return "bg-green-100 text-green-800 border-green-200"
      case "under_maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "patient_admitted":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBedStatusText = (status: string) => {
    switch (status) {
      case "vacant":
        return "Vacant"
      case "under_maintenance":
        return "Under Maintenance"
      case "patient_admitted":
        return "Patient Admitted"
      default:
        return "Unknown"
    }
  }

  const handlePatientInfo = (bedId: string) => {
    const patient = getPatientForBed(bedId)
    if (patient) {
      setSelectedPatient(patient)
      setShowPatientInfo(true)
    }
  }

  const handleAddExpense = (bedId: string) => {
    const patient = getPatientForBed(bedId)
    if (patient) {
      setSelectedPatient(patient)
      setShowAddExpense(true)
    }
  }

  const handleDischargeSummary = (bedId: string) => {
    const patient = getPatientForBed(bedId)
    if (patient) {
      setSelectedPatient(patient)
      setShowDischargeSummary(true)
    }
  }

  if (loading) {
    return <LoadingCard title="Loading beds..." description="Please wait while we fetch the bed information" />
  }

  return (
    <div className="space-y-6">
      {/* Animated header with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Available Beds</p>
                <p className="text-2xl font-bold text-green-800">
                  {beds.filter((bed) => bed.status === "vacant").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Occupied Beds</p>
                <p className="text-2xl font-bold text-red-800">
                  {beds.filter((bed) => bed.status === "patient_admitted").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {beds.filter((bed) => bed.status === "under_maintenance").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Beds</p>
                <p className="text-2xl font-bold text-blue-800">{beds.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {beds.map((bed, index) => {
          const patient = getPatientForBed(bed.id)
          return (
            <Card
              key={bed.id}
              className={`professional-bed-card hover:scale-105 ${
                bed.status === "patient_admitted"
                  ? "bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:from-red-100 hover:to-rose-200"
                  : bed.status === "vacant"
                    ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:from-green-100 hover:to-emerald-200"
                    : "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200 hover:from-yellow-100 hover:to-amber-200"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated status indicator */}
              <div
                className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
                  bed.status === "patient_admitted"
                    ? "bg-red-500 animate-pulse"
                    : bed.status === "vacant"
                      ? "bg-green-500 animate-pulse"
                      : "bg-yellow-500 animate-pulse"
                }`}
              ></div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span>Bed {bed.bed_number}</span>
                    {bed.status === "patient_admitted" && <Heart className="w-4 h-4 text-red-500 animate-pulse" />}
                  </CardTitle>
                  <Badge className={`${getBedStatusColor(bed.status)} animate-in slide-in-from-right duration-300`}>
                    {getBedStatusText(bed.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="relative transform hover:scale-110 transition-transform duration-300">
                    <div
                      className={`w-16 h-24 rounded-lg border-2 relative shadow-lg ${
                        bed.status === "patient_admitted"
                          ? "bg-red-200 border-red-400"
                          : bed.status === "vacant"
                            ? "bg-green-200 border-green-400"
                            : "bg-yellow-200 border-yellow-400"
                      }`}
                    >
                      {/* Bed frame with gradient */}
                      <div className="absolute inset-1 bg-gradient-to-b from-white to-gray-100 rounded border border-slate-300 shadow-inner"></div>
                      {/* Pillow with shadow */}
                      <div className="absolute top-1 left-1 right-1 h-3 bg-gradient-to-b from-blue-100 to-blue-200 rounded-t border-b border-slate-200 shadow-sm"></div>
                      {/* Bed number with glow effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-xs font-bold ${
                            bed.status === "patient_admitted"
                              ? "text-red-700"
                              : bed.status === "vacant"
                                ? "text-green-700"
                                : "text-yellow-700"
                          }`}
                        >
                          {bed.bed_number}
                        </span>
                      </div>
                      {/* Patient indicator */}
                      {patient && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce border-2 border-white"></div>
                      )}
                    </div>
                    {/* Enhanced bed legs with shadow */}
                    <div className="absolute -bottom-2 left-1 w-1 h-2 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-sm"></div>
                    <div className="absolute -bottom-2 right-1 w-1 h-2 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b shadow-sm"></div>
                  </div>
                </div>

                {patient && (
                  <div className="patient-info-container">
                    <div className="medical-text-container text-balance flex items-center justify-center gap-1 mb-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="font-medium text-center">{patient.name}</span>
                    </div>
                    <p className="medical-text-container text-balance text-slate-500 text-xs text-center leading-relaxed">
                      {patient.issue}
                    </p>
                  </div>
                )}

                {bed.status === "patient_admitted" && patient && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105 border-2 flex items-center justify-center"
                      onClick={() => handlePatientInfo(bed.id)}
                    >
                      <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Patient Info</span>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="medical-button-small bg-white/80 backdrop-blur-sm hover:bg-emerald-50 transition-all duration-300 hover:scale-105 border-2 border-emerald-200 text-emerald-700 hover:text-emerald-800 flex items-center justify-center"
                        onClick={() => handleAddExpense(bed.id)}
                      >
                        <Plus className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Expense</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="medical-button-small bg-white/80 backdrop-blur-sm hover:bg-blue-50 transition-all duration-300 hover:scale-105 border-2 border-blue-200 text-blue-700 hover:text-blue-800 flex items-center justify-center"
                        onClick={() => handleDischargeSummary(bed.id)}
                      >
                        <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Discharge</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialogs */}
      <PatientInfoDialog patient={selectedPatient} open={showPatientInfo} onOpenChange={setShowPatientInfo} />
      <AddExpenseDialog
        patient={selectedPatient}
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onExpenseAdded={fetchData}
      />
      <DischargeSummaryDialog
        patient={selectedPatient}
        open={showDischargeSummary}
        onOpenChange={setShowDischargeSummary}
        onSummaryCreated={fetchData}
      />
    </div>
  )
}
