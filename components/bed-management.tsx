"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, Plus, FileText } from "lucide-react"
import { PatientInfoDialog } from "./patient-info-dialog"
import { AddExpenseDialog } from "./add-expense-dialog"
import { DischargeSummaryDialog } from "./discharge-summary-dialog"

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
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-slate-600">Loading beds...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {beds.map((bed) => {
          const patient = getPatientForBed(bed.id)
          return (
            <Card key={bed.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Bed {bed.bed_number}</CardTitle>
                  <Badge className={getBedStatusColor(bed.status)}>{getBedStatusText(bed.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Bed Visual */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-24 bg-slate-300 rounded-lg border-2 border-slate-400 relative">
                      {/* Bed frame */}
                      <div className="absolute inset-1 bg-white rounded border border-slate-300"></div>
                      {/* Pillow */}
                      <div className="absolute top-1 left-1 right-1 h-3 bg-slate-100 rounded-t border-b border-slate-200"></div>
                      {/* Bed number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-600">{bed.bed_number}</span>
                      </div>
                    </div>
                    {/* Bed legs */}
                    <div className="absolute -bottom-2 left-1 w-1 h-2 bg-slate-400 rounded-b"></div>
                    <div className="absolute -bottom-2 right-1 w-1 h-2 bg-slate-400 rounded-b"></div>
                  </div>
                </div>

                {patient && (
                  <div className="text-sm text-slate-600 text-center">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs">{patient.issue}</p>
                  </div>
                )}

                {bed.status === "patient_admitted" && patient && (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handlePatientInfo(bed.id)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Patient Info
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddExpense(bed.id)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Expense
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDischargeSummary(bed.id)}>
                        <FileText className="w-4 h-4 mr-1" />
                        Discharge
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
