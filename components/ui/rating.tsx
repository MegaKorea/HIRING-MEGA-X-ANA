"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const starVariants = cva(
  "shrink-0 transition-[color,fill,transform] duration-200 ease-out",
  {
    variants: {
      size: {
        sm: "size-3.5",
        default: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const valueVariants = cva("text-muted-foreground tabular-nums", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type RatingProps = React.ComponentProps<"div"> &
  VariantProps<typeof ratingVariants> & {
    rating: number
    maxRating?: number
    showValue?: boolean
    starClassName?: string
    editable?: boolean
    onRatingChange?: (rating: number) => void
  }

function Rating({
  rating,
  maxRating = 5,
  size,
  className,
  starClassName,
  showValue = false,
  editable = false,
  onRatingChange,
  ...props
}: RatingProps) {
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null)
  const displayRating =
    editable && hoveredRating !== null ? hoveredRating : rating

  function select(star: number) {
    if (editable) onRatingChange?.(star)
  }

  return (
    <div
      data-slot="rating"
      role={editable ? "radiogroup" : "img"}
      aria-label={`Đánh giá ${displayRating} trên ${maxRating}`}
      className={cn(ratingVariants({ size }), className)}
      onMouseLeave={() => {
        if (editable) setHoveredRating(null)
      }}
      {...props}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const star = index + 1
        const filled = displayRating >= star
        const partial = displayRating > star - 1 && displayRating < star
        const fillWidth = filled
          ? "100%"
          : partial
            ? `${(displayRating - (star - 1)) * 100}%`
            : "0%"

        return (
          <div
            key={star}
            role={editable ? "radio" : undefined}
            aria-checked={editable ? filled || partial : undefined}
            tabIndex={editable ? 0 : undefined}
            className={cn(
              "relative outline-none",
              editable &&
                "cursor-pointer transition-transform duration-150 ease-out hover:scale-110 active:scale-95"
            )}
            onClick={() => select(star)}
            onMouseEnter={() => {
              if (editable) setHoveredRating(star)
            }}
            onKeyDown={(event) => {
              if (!editable) return
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                select(star)
              }
            }}
          >
            <StarIcon
              data-slot="rating-star-empty"
              className={cn(starVariants({ size }), "text-muted-foreground/25")}
            />
            <div
              className="absolute inset-0 overflow-hidden transition-[width] duration-200 ease-out"
              style={{ width: fillWidth }}
            >
              <StarIcon
                data-slot="rating-star-filled"
                className={cn(
                  starVariants({ size }),
                  "fill-amber-400 text-amber-400",
                  editable &&
                    hoveredRating !== null &&
                    "drop-shadow-[0_0_4px_rgba(251,191,36,0.45)]",
                  starClassName
                )}
              />
            </div>
          </div>
        )
      })}
      {showValue ? (
        <span
          data-slot="rating-value"
          className={cn(valueVariants({ size }), "ml-1")}
        >
          {displayRating.toFixed(1)}
        </span>
      ) : null}
    </div>
  )
}

export { Rating }
