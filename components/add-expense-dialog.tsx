"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, Calendar, FileText, Sparkles, CheckCircle2, TrendingUp } from "lucide-react"
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

interface AddExpenseDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpenseAdded: () => void
}

const commonExpenses = [
  { name: "X-Ray", price: 800 },
  { name: "CT Scan", price: 4500 },
  { name: "MRI Scan", price: 8500 },
  { name: "Blood Test", price: 500 },
  { name: "Ultrasound", price: 1200 },
  { name: "ECG", price: 300 },
  { name: "Drug Injection", price: 250 },
  { name: "Dressing", price: 150 },
  { name: "Consultation Fee", price: 600 },
  { name: "Surgery Fee", price: 25000 },
  { name: "Room Charges (per day)", price: 2000 },
  { name: "Nursing Care (per day)", price: 1500 },
  { name: "ICU Charges (per day)", price: 5000 },
  { name: "Physiotherapy", price: 800 },
  { name: "Laboratory Tests", price: 1200 },
  { name: "Medicines", price: 600 },
]

export function AddExpenseDialog({ patient, open, onOpenChange, onExpenseAdded }: AddExpenseDialogProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedQuickExpense, setSelectedQuickExpense] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient || !description || !amount) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("expenses").insert({
        patient_id: patient.id,
        description,
        amount: Number.parseFloat(amount),
        expense_date: expenseDate,
      })

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      toast({
        title: "Expense Added Successfully! 🎉",
        description: `Added ${description} for ₹${Number.parseFloat(amount).toLocaleString("en-IN")}`,
      })

      setDescription("")
      setAmount("")
      setExpenseDate(new Date().toISOString().split("T")[0])
      setSelectedQuickExpense(null)
      onExpenseAdded()

      setTimeout(() => onOpenChange(false), 1500)
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickExpense = (expenseName: string, price: number) => {
    setSelectedQuickExpense(expenseName)
    setDescription(expenseName)
    setAmount(price.toString())

    setTimeout(() => setSelectedQuickExpense(null), 300)
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[55]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="relative">
              <Plus className="w-6 h-6 text-green-600" />
              <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            Add Medical Expense
          </DialogTitle>
          <p className="text-slate-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Patient: <span className="font-semibold">{patient.name}</span>
          </p>
        </DialogHeader>

        {showSuccess && (
          <div className="fixed inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-300">
            <div className="bg-white rounded-lg p-8 shadow-2xl animate-in zoom-in duration-500">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-green-700 mb-2">Expense Added!</h3>
                <p className="text-green-600">Successfully recorded medical expense</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <div className="relative">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="absolute -inset-1 bg-blue-200 rounded-full animate-pulse opacity-20"></div>
                </div>
                Quick Expense Selection
              </CardTitle>
              <p className="text-sm text-slate-600">Click on any common expense to auto-fill the form</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonExpenses.map((expense) => (
                  <Button
                    key={expense.name}
                    variant="outline"
                    size="sm"
                    className={`justify-start text-left h-auto p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedQuickExpense === expense.name
                        ? "bg-green-100 border-green-300 scale-105 shadow-lg"
                        : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                    }`}
                    onClick={() => handleQuickExpense(expense.name, expense.price)}
                  >
                    <div className="w-full">
                      <div className="font-medium text-sm mb-1 text-slate-700">{expense.name}</div>
                      <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="text-emerald-600">₹</span>
                        {expense.price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <div className="absolute -inset-1 bg-emerald-200 rounded-full animate-pulse opacity-30"></div>
                </div>
                Manual Expense Entry
              </CardTitle>
              <p className="text-sm text-slate-600">Enter custom expense details or modify selected amounts</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">
                      Expense Description *
                    </Label>
                    <Input
                      id="description"
                      placeholder="e.g., X-Ray, Blood Test, Surgery"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-2 border-slate-200 focus:border-emerald-400 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-slate-700 font-medium">
                      Amount (₹) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-semibold">
                        ₹
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        step="1"
                        min="0"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 border-2 border-slate-200 focus:border-emerald-400 transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-date" className="flex items-center gap-2 text-slate-700 font-medium">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Expense Date *
                  </Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="border-2 border-slate-200 focus:border-blue-400 transition-colors duration-300"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || !description || !amount}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Expense
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="px-8 border-2 border-slate-300 hover:border-slate-400 transition-colors duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {(description || amount) && (
            <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  Expense Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                  <div>
                    <p className="font-semibold text-slate-800">{description || "No description"}</p>
                    <p className="text-sm text-slate-600">Date: {expenseDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{amount ? Number.parseFloat(amount).toLocaleString("en-IN") : "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
