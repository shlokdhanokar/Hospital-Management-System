"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, Calendar, FileText } from "lucide-react"
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
  { name: "X-Ray", price: 150 },
  { name: "CT Scan", price: 500 },
  { name: "MRI Scan", price: 800 },
  { name: "Blood Test", price: 75 },
  { name: "Ultrasound", price: 200 },
  { name: "ECG", price: 100 },
  { name: "Drug Injection", price: 50 },
  { name: "Dressing", price: 25 },
  { name: "Consultation Fee", price: 100 },
  { name: "Surgery Fee", price: 2500 },
  { name: "Room Charges", price: 200 },
  { name: "Nursing Care", price: 150 },
]

export function AddExpenseDialog({ patient, open, onOpenChange, onExpenseAdded }: AddExpenseDialogProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
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

      toast({
        title: "Expense Added",
        description: `Successfully added ${description} for $${amount}`,
      })

      // Reset form
      setDescription("")
      setAmount("")
      setExpenseDate(new Date().toISOString().split("T")[0])
      onExpenseAdded()
      onOpenChange(false)
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
    setDescription(expenseName)
    setAmount(price.toString())
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-green-600" />
            Add New Expense
          </DialogTitle>
          <p className="text-slate-600">Patient: {patient.name}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Expense Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quick Expense Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonExpenses.map((expense) => (
                  <Button
                    key={expense.name}
                    variant="outline"
                    size="sm"
                    className="justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => handleQuickExpense(expense.name, expense.price)}
                  >
                    <div>
                      <div className="font-medium text-sm">{expense.name}</div>
                      <div className="text-xs text-slate-500">${expense.price}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manual Expense Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="e.g., X-Ray, Blood Test, Surgery"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Expense Date
                  </Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Adding..." : "Add Expense"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
