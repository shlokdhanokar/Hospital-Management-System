"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, DollarSign, Calendar, User, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface Expense {
  id: string
  description: string
  amount: number
  expense_date: string
}

interface DischargeSummaryDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSummaryCreated: () => void
}

export function DischargeSummaryDialog({ patient, open, onOpenChange, onSummaryCreated }: DischargeSummaryDialogProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summaryText, setSummaryText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (patient && open) {
      fetchExpenses()
      generateDefaultSummary()
    }
  }, [patient, open])

  const fetchExpenses = async () => {
    if (!patient) return

    setLoadingExpenses(true)
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("patient_id", patient.id)
        .order("expense_date", { ascending: true })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoadingExpenses(false)
    }
  }

  const generateDefaultSummary = () => {
    if (!patient) return

    const summary = `DISCHARGE SUMMARY

Patient Name: ${patient.name}
Date of Birth: ${new Date(patient.date_of_birth).toLocaleDateString()}
Blood Group: ${patient.blood_group}
Admission Date: ${new Date(patient.admission_date).toLocaleDateString()}
Discharge Date: ${new Date().toLocaleDateString()}

DIAGNOSIS:
${patient.issue}

TREATMENT PROVIDED:
The patient was admitted with ${patient.issue.toLowerCase()} and received comprehensive medical care under the supervision of ${patient.doctor}. 

MEDICATIONS PRESCRIBED:
${patient.medicines || "No specific medications prescribed"}

RECOVERY STATUS:
Patient showed ${patient.recovery_rate}% recovery during the treatment period.

DISCHARGE INSTRUCTIONS:
1. Continue prescribed medications as directed
2. Follow up with ${patient.doctor} in 1-2 weeks
3. Rest and avoid strenuous activities
4. Contact hospital immediately if symptoms worsen

FOLLOW-UP CARE:
Regular monitoring recommended. Next appointment scheduled as per doctor's advice.

Attending Physician: ${patient.doctor}
Discharge Date: ${new Date().toLocaleDateString()}`

    setSummaryText(summary)
  }

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const handleCreateSummary = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient || !summaryText.trim()) return

    setIsLoading(true)
    try {
      const totalBill = calculateTotal()

      // Create discharge summary
      const { error: summaryError } = await supabase.from("discharge_summaries").insert({
        patient_id: patient.id,
        summary_text: summaryText,
        total_bill: totalBill,
        discharge_date: new Date().toISOString().split("T")[0],
      })

      if (summaryError) throw summaryError

      // Update bed status to vacant and remove patient
      const { error: bedError } = await supabase.from("beds").update({ status: "vacant" }).eq("id", patient.bed_id)

      if (bedError) throw bedError

      // Remove patient from bed
      const { error: patientError } = await supabase.from("patients").update({ bed_id: null }).eq("id", patient.id)

      if (patientError) throw patientError

      toast({
        title: "Discharge Summary Created",
        description: `Successfully created discharge summary for ${patient.name}`,
      })

      onSummaryCreated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating discharge summary:", error)
      toast({
        title: "Error",
        description: "Failed to create discharge summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadSummary = () => {
    if (!patient) return

    const totalBill = calculateTotal()
    const fullSummary = `${summaryText}

BILLING SUMMARY:
${expenses.map((expense) => `${expense.description}: $${expense.amount.toFixed(2)}`).join("\n")}

TOTAL AMOUNT: $${totalBill.toFixed(2)}`

    const blob = new Blob([fullSummary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `discharge-summary-${patient.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!patient) return null

  const totalBill = calculateTotal()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Create Discharge Summary
          </DialogTitle>
          <p className="text-slate-600">Patient: {patient.name}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Summary Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Discharge Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSummary} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary Details</Label>
                    <Textarea
                      id="summary"
                      placeholder="Enter discharge summary details..."
                      value={summaryText}
                      onChange={(e) => setSummaryText(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? "Creating..." : "Create Summary"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleDownloadSummary}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Patient Info & Billing */}
          <div className="space-y-4">
            {/* Patient Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Name:</span>
                    <p className="text-slate-800">{patient.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Blood Group:</span>
                    <p className="text-slate-800">{patient.blood_group}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Issue:</span>
                    <p className="text-slate-800">{patient.issue}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Doctor:</span>
                    <p className="text-slate-800">{patient.doctor}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Admission:</span>
                    <p className="text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(patient.admission_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Recovery:</span>
                    <p className="text-slate-800">{patient.recovery_rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Billing Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingExpenses ? (
                  <p className="text-slate-600">Loading expenses...</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.length === 0 ? (
                      <p className="text-slate-600 text-sm">No expenses recorded</p>
                    ) : (
                      <div className="space-y-2">
                        {expenses.map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium text-slate-800">{expense.description}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(expense.expense_date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-semibold text-slate-800">${expense.amount.toFixed(2)}</p>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span className="text-slate-800">Total Amount:</span>
                          <span className="text-green-600">${totalBill.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
