import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title?: string; subtitle?: string }
>(({ className, title, subtitle, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-2xl text-foreground shadow-2xl hover:shadow-3xl transition-all duration-300",
      className
    )}
    {...props}
  >
    {(title || subtitle) && (
      <div className="p-8 pb-0">
        {title && <h3 className="text-xl font-semibold text-foreground tracking-tight">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-400 mt-2 font-medium">{subtitle}</p>}
      </div>
    )}
    <div className="p-8">
      {children}
    </div>
  </div>
))
Card.displayName = "Card"

export { Card }