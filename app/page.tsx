"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { BedManagement } from "@/components/bed-management"
import { OPDManagement } from "@/components/opd-management"
import { PatientAdmission } from "@/components/patient-admission"
import { DischargedPatients } from "@/components/discharged-patients"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<"beds" | "opd" | "admission" | "discharged" | "reports">("beds")

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation currentSection={currentSection} onSectionChange={setCurrentSection} />

        <main className="md:ml-72 medical-spacing-md">
          <div className="max-w-7xl mx-auto">
            {currentSection === "beds" && (
              <ErrorBoundary>
                <div className="medical-spacing-md">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Bed Management</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Manage patient beds, expenses, and discharge summaries
                    </p>
                  </header>
                  <BedManagement />
                </div>
              </ErrorBoundary>
            )}

            {currentSection === "admission" && (
              <ErrorBoundary>
                <div className="medical-spacing-md">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Patient Admission</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Admit new patients with document upload and data extraction
                    </p>
                  </header>
                  <PatientAdmission />
                </div>
              </ErrorBoundary>
            )}

            {currentSection === "discharged" && (
              <ErrorBoundary>
                <div className="medical-spacing-md">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Discharged Patients</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Manage discharged patients and track payment status
                    </p>
                  </header>
                  <DischargedPatients />
                </div>
              </ErrorBoundary>
            )}

            {currentSection === "opd" && (
              <ErrorBoundary>
                <div className="medical-spacing-md">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">OPD Management</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Manage outpatient department and patient queue
                    </p>
                  </header>
                  <OPDManagement />
                </div>
              </ErrorBoundary>
            )}

            {currentSection === "reports" && (
              <ErrorBoundary>
                <div className="medical-spacing-md">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Reports & Analytics</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      View hospital statistics, financial reports, and analytics
                    </p>
                  </header>
                  <ReportsAnalytics />
                </div>
              </ErrorBoundary>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
