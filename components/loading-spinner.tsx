import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)}
    />
  )
}

export function LoadingCard({ title = "Loading...", description }: { title?: string; description?: string }) {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  )
}
