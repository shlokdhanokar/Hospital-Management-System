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
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  DollarSign,
  Calendar,
  User,
  FileDown,
  Download,
  CreditCard,
  Receipt,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Phone,
  Shield,
} from "lucide-react"
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
${expenses.map((expense) => `${expense.description}: ₹${expense.amount.toLocaleString("en-IN")}`).join("\n")}

TOTAL AMOUNT: ₹${totalBill.toLocaleString("en-IN")}`

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

  const generatePDFBill = () => {
    if (!patient) return

    const totalBill = calculateTotal()
    const currentDate = new Date().toLocaleDateString("en-IN")

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Discharge Summary & Bill - ${patient.name}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #164e63;
            padding-bottom: 20px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px 20px 20px;
            border-radius: 8px 8px 0 0;
          }
          .hospital-name {
            font-size: 32px;
            font-weight: bold;
            color: #164e63;
            margin-bottom: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          .hospital-subtitle {
            font-size: 16px;
            color: #475569;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .hospital-address {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 15px;
          }
          .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #1d4ed8;
            margin-top: 20px;
            padding: 10px 20px;
            background: #dbeafe;
            border-radius: 6px;
            display: inline-block;
          }
          .bill-number {
            font-size: 14px;
            color: #64748b;
            margin-top: 10px;
          }
          .patient-info {
            background: #f8fafc;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 6px solid #164e63;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .info-item {
            margin-bottom: 12px;
          }
          .info-label {
            font-weight: 600;
            color: #475569;
            display: block;
            margin-bottom: 4px;
            font-size: 14px;
          }
          .info-value {
            color: #1e293b;
            font-size: 16px;
            font-weight: 500;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #164e63;
            border-bottom: 3px solid #e2e8f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
            position: relative;
          }
          .section-title::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: #164e63;
          }
          .summary-text {
            background: #ffffff;
            padding: 25px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            white-space: pre-line;
            font-size: 15px;
            line-height: 1.8;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .billing-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .billing-table th {
            background: linear-gradient(135deg, #164e63 0%, #0f3a4a 100%);
            color: white;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 15px;
          }
          .billing-table td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 15px;
          }
          .billing-table tr:last-child td {
            border-bottom: none;
          }
          .billing-table tr:nth-child(even) {
            background: #f8fafc;
          }
          .billing-table tr:hover {
            background: #f1f5f9;
          }
          .total-row {
            background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%) !important;
            font-weight: bold;
            font-size: 18px;
            border-top: 3px solid #164e63;
          }
          .total-amount {
            color: #059669;
            font-size: 20px;
            font-weight: 700;
          }
          .currency-symbol {
            font-size: 18px;
            margin-right: 2px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 13px;
            background: #f8fafc;
            padding: 25px;
            border-radius: 8px;
          }
          .signature-section {
            margin-top: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
          .signature-box {
            text-align: center;
            padding-top: 40px;
            border-top: 2px solid #333;
            font-weight: 500;
          }
          .signature-title {
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 8px;
          }
          .signature-name {
            font-size: 14px;
            color: #64748b;
          }
          .payment-terms {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">MediCare Hospital</div>
          <div class="hospital-subtitle">Advanced Healthcare Solutions</div>
          <div class="hospital-address">123 Medical Center Drive, Healthcare City, Mumbai - 400001</div>
          <div class="hospital-address">Phone: +91 22 1234 5678 | Email: info@medicare.in | GSTIN: 27ABCDE1234F1Z5</div>
          <div class="document-title">DISCHARGE SUMMARY & MEDICAL BILL</div>
          <div class="bill-number">Bill No: MCH/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}</div>
        </div>

        <div class="patient-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patient Name:</span>
              <span class="info-value">${patient.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">${new Date(patient.date_of_birth).toLocaleDateString("en-IN")}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Blood Group:</span>
              <span class="info-value">${patient.blood_group}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Admission Date:</span>
              <span class="info-value">${new Date(patient.admission_date).toLocaleDateString("en-IN")}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Discharge Date:</span>
              <span class="info-value">${currentDate}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Attending Doctor:</span>
              <span class="info-value">${patient.doctor}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Recovery Rate:</span>
              <span class="info-value">${patient.recovery_rate}%</span>
            </div>
            <div class="info-item">
              <span class="info-label">Emergency Contact:</span>
              <span class="info-value">${patient.caretaker_name} (+91 ${patient.caretaker_contact})</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Medical Summary</div>
          <div class="summary-text">${summaryText}</div>
        </div>

        <div class="section">
          <div class="section-title">Billing Details</div>
          <table class="billing-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th style="text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${expenses
                .map(
                  (expense) => `
                <tr>
                  <td>${expense.description}</td>
                  <td>${new Date(expense.expense_date).toLocaleDateString("en-IN")}</td>
                  <td style="text-align: right;"><span class="currency-symbol">₹</span>${expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="2"><strong>TOTAL AMOUNT DUE</strong></td>
                <td class="total-amount" style="text-align: right;"><span class="currency-symbol">₹</span>${totalBill.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="payment-terms">
            <strong>Payment Terms:</strong> Payment is due within 30 days of discharge. For insurance claims, please contact our billing department. All payments should be made in Indian Rupees (INR).
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-title">Doctor's Signature</div>
            <div class="signature-name">${patient.doctor}</div>
            <div class="signature-name">MBBS, MD</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Hospital Administrator</div>
            <div class="signature-name">MediCare Hospital</div>
            <div class="signature-name">Mumbai</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Important:</strong> This is a computer-generated document. For any queries, please contact the hospital administration.</p>
          <p>Generated on: ${new Date().toLocaleString("en-IN")} | Valid for insurance and reimbursement purposes</p>
          <p>MediCare Hospital - Committed to Excellence in Healthcare</p>
        </div>
      </body>
      </html>
    `

    // Create and download PDF
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `discharge-bill-${patient.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Also trigger print dialog for immediate PDF generation
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  if (!patient) return null

  const totalBill = calculateTotal()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden z-[100] p-0 bg-white shadow-2xl border-0 rounded-2xl"
        showCloseButton={true}
      >
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="text-4xl font-bold flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-10 h-10" />
                </div>
                Patient Discharge Portal
              </DialogTitle>
              <div className="flex items-center gap-6 mt-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                  <User className="w-5 h-5 mr-2" />
                  {patient?.name}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  {patient && new Date().toLocaleDateString("en-IN")}
                </Badge>
              </div>
            </DialogHeader>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(98vh-160px)] p-8">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-12">
            {/* Left Side - Patient Information & Summary */}
            <div className="space-y-8">
              {/* Patient Information Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Stethoscope className="w-7 h-7" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <User className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Full Name</p>
                        <p className="font-semibold text-slate-800 text-lg">{patient?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                      <Heart className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Blood Group</p>
                        <p className="font-semibold text-slate-800 text-lg">{patient?.blood_group}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <Activity className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Medical Issue</p>
                        <p className="font-semibold text-slate-800 text-lg">{patient?.issue}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Recovery Rate</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${patient?.recovery_rate}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-slate-800 text-lg">{patient?.recovery_rate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <Stethoscope className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Attending Doctor</p>
                        <p className="font-semibold text-slate-800 text-lg">{patient?.doctor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                      <Phone className="w-6 h-6 text-cyan-600" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Emergency Contact</p>
                        <p className="font-semibold text-slate-800 text-lg">{patient?.caretaker_name}</p>
                        <p className="text-sm text-slate-600">+91 {patient?.caretaker_contact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <Pill className="w-6 h-6 text-amber-600" />
                    <div className="w-full">
                      <p className="text-sm text-slate-600 font-medium mb-2">Prescribed Medicines</p>
                      <p className="font-semibold text-slate-800 text-base">
                        {patient?.medicines || "No specific medications prescribed"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Discharge Summary Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="w-7 h-7" />
                    Medical Discharge Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleCreateSummary} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="summary" className="text-slate-700 font-semibold text-lg">
                        Summary Details
                      </Label>
                      <Textarea
                        id="summary"
                        placeholder="Enter comprehensive discharge summary details..."
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                        className="min-h-[400px] font-mono text-base border-2 border-slate-200 focus:border-blue-400 transition-colors duration-200 bg-white/80 backdrop-blur-sm p-4"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing Discharge...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" />
                            Complete Discharge Process
                          </div>
                        )}
                      </Button>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDownloadSummary}
                          className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 py-3 text-base"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Summary PDF
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generatePDFBill}
                          className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 py-3 text-base"
                        >
                          <Receipt className="w-5 h-5 mr-2" />
                          Bill PDF
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Billing Summary */}
            <div className="space-y-8">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50 hover:shadow-3xl transition-all duration-500 transform hover:scale-102">
                <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative overflow-hidden p-8">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <CreditCard className="w-8 h-8" />
                      Billing Summary
                    </CardTitle>
                    <p className="text-white/80 text-lg mt-2">Complete payment breakdown</p>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {loadingExpenses ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-600 text-lg">Loading billing information...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {expenses.length === 0 ? (
                        <div className="text-center py-12">
                          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-500 text-xl">No expenses recorded</p>
                          <p className="text-base text-slate-400">All services were complimentary</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                            <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-3 text-lg">
                              <Receipt className="w-5 h-5" />
                              Itemized Charges
                            </h4>
                            <div className="space-y-4">
                              {expenses.map((expense, index) => (
                                <div
                                  key={expense.id}
                                  className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-800 text-lg">{expense.description}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(expense.expense_date).toLocaleDateString("en-IN")}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-xl text-slate-800">
                                      ₹{expense.amount.toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="relative z-10">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white/80 text-lg font-medium">Total Amount Due</p>
                                  <p className="text-4xl font-bold mt-2">₹{totalBill.toLocaleString("en-IN")}</p>
                                  <p className="text-white/70 text-base mt-2">Including all applicable charges</p>
                                </div>
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                  <DollarSign className="w-12 h-12" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                            <div className="flex items-start gap-4">
                              <Clock className="w-6 h-6 text-amber-600 mt-1" />
                              <div>
                                <h5 className="font-semibold text-amber-800 mb-2 text-lg">Payment Terms</h5>
                                <p className="text-base text-amber-700">
                                  Payment is due within 30 days of discharge. For insurance claims, please contact our
                                  billing department at +91 22 1234 5678.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 mt-8">
                            <Button
                              onClick={generatePDFBill}
                              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                              <FileDown className="w-6 h-6 mr-3" />
                              Download Complete Bill & Summary
                            </Button>

                            <Button
                              onClick={handleDownloadSummary}
                              variant="outline"
                              className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 py-4 text-lg"
                            >
                              <Download className="w-6 h-6 mr-3" />
                              Download Summary Only
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
