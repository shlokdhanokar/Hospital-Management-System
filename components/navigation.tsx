"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bed, Users, Menu, X, Activity, Calendar, UserPlus, FileCheck, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentSection: "beds" | "opd" | "admission" | "discharged" | "reports"
  onSectionChange: (section: "beds" | "opd" | "admission" | "discharged" | "reports") => void
}

export function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      id: "beds" as const,
      label: "Bed Management",
      icon: Bed,
      description: "Manage hospital beds and inpatients",
    },
    {
      id: "admission" as const,
      label: "Patient Admission",
      icon: UserPlus,
      description: "Admit new patients with document upload",
    },
    {
      id: "discharged" as const,
      label: "Discharged Patients",
      icon: FileCheck,
      description: "Manage discharged patients and payments",
    },
    {
      id: "opd" as const,
      label: "OPD Management",
      icon: Users,
      description: "Manage outpatient department and queue",
    },
    {
      id: "reports" as const,
      label: "Reports & Analytics",
      icon: BarChart3,
      description: "View hospital statistics and reports",
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-card shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="medical-spacing-md h-full flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground text-balance">MediCare</h1>
                <p className="text-sm text-sidebar-foreground/70 font-medium">Hospital Management System</p>
              </div>
            </div>
            <div className="h-px bg-sidebar-border"></div>
          </div>

          <nav className="space-y-3 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto py-4 px-4 text-left rounded-lg transition-all duration-200 flex items-start",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm",
                  )}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsOpen(false)
                  }}
                >
                  <Icon className="w-5 h-5 mr-4 flex-shrink-0" />
                  <div className="medical-text-container w-full">
                    <div className="font-semibold text-sm leading-tight">{item.label}</div>
                    <div className="nav-description text-xs opacity-80 mt-1 leading-relaxed">{item.description}</div>
                  </div>
                </Button>
              )
            })}
          </nav>

          <Card className="mt-6 p-4 bg-card/80 border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="medical-text-container">
                <p className="text-sm font-semibold text-card-foreground">Today</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
