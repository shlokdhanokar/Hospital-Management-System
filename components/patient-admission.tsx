"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, User, Stethoscope, CheckCircle, AlertCircle, Edit3, FileUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingCard } from "./loading-spinner"

interface PatientFormData {
  name: string
  date_of_birth: string
  blood_group: string
  phone: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  issue: string
  doctor: string
  medicines: string
  caretaker_name: string
  caretaker_contact: string
  bed_id: string
}

export function PatientAdmission() {
  const [beds, setBeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<PatientFormData> | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [admissionMethod, setAdmissionMethod] = useState<"document" | "manual" | null>(null)
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    date_of_birth: "",
    blood_group: "",
    phone: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    issue: "",
    doctor: "",
    medicines: "",
    caretaker_name: "",
    caretaker_contact: "",
    bed_id: "",
  })

  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchVacantBeds()
  }, [])

  const fetchVacantBeds = async () => {
    try {
      const { data, error } = await supabase.from("beds").select("*").eq("status", "vacant").order("bed_number")

      if (error) throw error
      setBeds(data || [])
    } catch (error) {
      console.error("Error fetching beds:", error)
      toast({
        title: "Error",
        description: "Failed to fetch available beds",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedDocument(file)

    // Simulate document processing and data extraction
    setTimeout(() => {
      const mockExtractedData = {
        name: "Rajesh Kumar Sharma",
        date_of_birth: "1985-06-15",
        blood_group: "O+",
        phone: "+91 9876543210",
        address: "123 MG Road, Andheri West, Mumbai, Maharashtra 400058",
        emergency_contact_name: "Priya Sharma",
        emergency_contact_phone: "+91 9876543211",
        issue: "Acute chest pain with shortness of breath, suspected cardiac condition",
        doctor: "Dr. Anil Mehta",
      }

      setExtractedData(mockExtractedData)
      setFormData((prev) => ({ ...prev, ...mockExtractedData }))

      toast({
        title: "Document Processed",
        description: "Patient data has been extracted from the document",
      })
    }, 2000)
  }

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.bed_id) {
      toast({
        title: "Error",
        description: "Please select a bed for the patient",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // Insert patient data
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .insert({
          ...formData,
          admission_date: new Date().toISOString(),
          recovery_rate: 0,
          expected_discharge_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        })
        .select()
        .single()

      if (patientError) throw patientError

      // Update bed status
      const { error: bedError } = await supabase
        .from("beds")
        .update({ status: "patient_admitted" })
        .eq("id", formData.bed_id)

      if (bedError) throw bedError

      toast({
        title: "Success",
        description: "Patient has been successfully admitted",
      })

      // Reset form
      setFormData({
        name: "",
        date_of_birth: "",
        blood_group: "",
        phone: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        issue: "",
        doctor: "",
        medicines: "",
        caretaker_name: "",
        caretaker_contact: "",
        bed_id: "",
      })
      setUploadedDocument(null)
      setExtractedData(null)
      setCurrentStep(1)
      setAdmissionMethod(null)
      fetchVacantBeds()
    } catch (error) {
      console.error("Error admitting patient:", error)
      toast({
        title: "Error",
        description: "Failed to admit patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Admission Method", icon: Upload },
    { number: 2, title: "Patient Information", icon: User },
    { number: 3, title: "Medical Details", icon: Stethoscope },
    { number: 4, title: "Review & Admit", icon: CheckCircle },
  ]

  if (loading) {
    return (
      <LoadingCard title="Loading admission system..." description="Please wait while we prepare the admission form" />
    )
  }

  return (
    <div className="medical-spacing-md">
      {/* Progress Steps */}
      <Card className="medical-card mb-8">
        <CardContent className="medical-spacing-md">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${index < steps.length - 1 ? "flex-1" : ""}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="medical-text-container">
                      <p className={`font-semibold text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px flex-1 mx-4 ${currentStep > step.number ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Admission Method Selection */}
          {currentStep === 1 && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-primary" />
                  Choose Admission Method
                </CardTitle>
              </CardHeader>
              <CardContent className="medical-spacing-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Upload Option */}
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      admissionMethod === "document" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAdmissionMethod("document")}
                  >
                    <CardContent className="p-6 text-center">
                      <FileUp className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload patient documents and automatically extract information
                      </p>
                      <Badge variant={admissionMethod === "document" ? "default" : "secondary"}>Recommended</Badge>
                    </CardContent>
                  </Card>

                  {/* Manual Entry Option */}
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      admissionMethod === "manual" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAdmissionMethod("manual")}
                  >
                    <CardContent className="p-6 text-center">
                      <Edit3 className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Manual Entry</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter patient information manually using the form
                      </p>
                      <Badge variant={admissionMethod === "manual" ? "default" : "secondary"}>Traditional</Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Upload Section - Only show if document method selected */}
                {admissionMethod === "document" && (
                  <div className="mt-6">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold text-foreground mb-2">
                          {uploadedDocument ? uploadedDocument.name : "Upload Patient Document"}
                        </p>
                        <p className="text-muted-foreground">Drag and drop or click to select PDF, JPG, or PNG files</p>
                      </label>
                    </div>

                    {extractedData && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <p className="font-semibold text-foreground">Data Extracted Successfully</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Patient information has been automatically extracted from the document. You can review and
                          edit the details in the next steps.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!admissionMethod || (admissionMethod === "document" && !uploadedDocument)}
                    className="medical-button-primary"
                  >
                    Continue to Patient Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Patient Information */}
          {currentStep === 2 && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="medical-spacing-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="medical-input"
                      placeholder="Enter patient's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      className="medical-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group *</Label>
                    <Select
                      value={formData.blood_group}
                      onValueChange={(value) => handleInputChange("blood_group", value)}
                    >
                      <SelectTrigger className="medical-input">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="medical-input"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="medical-input"
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                      className="medical-input"
                      placeholder="Emergency contact person"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
                    <Input
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                      className="medical-input"
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.name || !formData.date_of_birth || !formData.blood_group || !formData.phone}
                    className="medical-button-primary"
                  >
                    Continue to Medical Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Medical Details */}
          {currentStep === 3 && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  Medical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="medical-spacing-md">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="issue">Medical Issue / Diagnosis *</Label>
                    <Textarea
                      id="issue"
                      value={formData.issue}
                      onChange={(e) => handleInputChange("issue", e.target.value)}
                      className="medical-input"
                      placeholder="Describe the patient's medical condition"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor">Attending Doctor *</Label>
                    <Input
                      id="doctor"
                      value={formData.doctor}
                      onChange={(e) => handleInputChange("doctor", e.target.value)}
                      className="medical-input"
                      placeholder="Dr. Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicines">Prescribed Medicines</Label>
                    <Textarea
                      id="medicines"
                      value={formData.medicines}
                      onChange={(e) => handleInputChange("medicines", e.target.value)}
                      className="medical-input"
                      placeholder="List prescribed medications and dosages"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="caretaker_name">Caretaker Name</Label>
                      <Input
                        id="caretaker_name"
                        value={formData.caretaker_name}
                        onChange={(e) => handleInputChange("caretaker_name", e.target.value)}
                        className="medical-input"
                        placeholder="Name of caretaker (if any)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caretaker_contact">Caretaker Contact</Label>
                      <Input
                        id="caretaker_contact"
                        value={formData.caretaker_contact}
                        onChange={(e) => handleInputChange("caretaker_contact", e.target.value)}
                        className="medical-input"
                        placeholder="Caretaker phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    disabled={!formData.issue || !formData.doctor}
                    className="medical-button-primary"
                  >
                    Continue to Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Bed Assignment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Admission Summary */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    Admission Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="medical-spacing-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                        <p className="font-semibold text-lg">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                        <p className="font-semibold">{formData.blood_group}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="font-semibold">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                        <p className="font-semibold">{formData.emergency_contact_name}</p>
                        <p className="text-sm text-muted-foreground">{formData.emergency_contact_phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Medical Issue</p>
                        <p className="font-semibold">{formData.issue}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Attending Doctor</p>
                        <p className="font-semibold">{formData.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Assigned Bed</p>
                        <p className="font-semibold">
                          {formData.bed_id
                            ? `Bed ${beds.find((b) => b.id === formData.bed_id)?.bed_number}`
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bed Assignment */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle>Select Bed</CardTitle>
                </CardHeader>
                <CardContent className="medical-spacing-md">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {beds.map((bed) => (
                      <div
                        key={bed.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.bed_id === bed.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleInputChange("bed_id", bed.id)}
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="font-semibold">Bed {bed.bed_number}</p>
                          <Badge variant="secondary" className="mt-1">
                            Available
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {beds.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-semibold text-foreground mb-2">No Available Beds</p>
                      <p className="text-muted-foreground">All beds are currently occupied. Please check back later.</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.bed_id || submitting}
                      className="medical-button-primary"
                    >
                      {submitting ? "Admitting Patient..." : "Admit Patient"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar - Only show summary on final step */}
        <div className="space-y-6">
          {currentStep < 4 && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="medical-spacing-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? "bg-primary" : "bg-muted"}`} />
                    <span className="text-sm">Admission Method</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
                    <span className="text-sm">Patient Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`} />
                    <span className="text-sm">Medical Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 4 ? "bg-primary" : "bg-muted"}`} />
                    <span className="text-sm">Review & Admit</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadedDocument && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg">Uploaded Document</CardTitle>
              </CardHeader>
              <CardContent className="medical-spacing-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="medical-text-container">
                    <p className="font-semibold text-sm">{uploadedDocument.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedDocument.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
