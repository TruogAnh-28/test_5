/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
/* eslint-disable react/no-array-index-key */
import * as React from "react"

import {
  addDays, addHours, addMinutes, format, subDays,
} from "date-fns"

import {
  chain,
} from "~/shared/utils/chain"
import {
  mergeRefs,
} from "~/shared/utils/merge-ref"
import {
  throttle,
} from "~/shared/utils/throttle"

import {
  Button, type ButtonProps,
} from "~/shared/components/ui/button"
import {
  useScheduler,
} from "~/shared/components/ui/full-calendar/scheduler-provider"
import {
  cn,
} from "~/shared/utils"

// Config
const HOURS = Array.from(
  {
    length: 24,
  },
  (
    _, i
  ) => `${i.toString().padStart(
    2, "0"
  )}:00`
)

type Handles = {
  handleAddEvent: (day: Date) => Date
  handleTimelineStyling: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

interface WeeklyViewContextProps {
  currentDate: Date
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  timelineRef: React.RefObject<HTMLDivElement>
  eventAreaRef: React.RefObject<HTMLDivElement>
  momentRef: React.RefObject<HTMLDivElement>
  handles: Handles
}

const WeeklyViewContext = React.createContext<WeeklyViewContextProps | null>(null)

export function useWeeklyView() {
  const context = React.useContext(WeeklyViewContext)
  if (!context) {
    throw new Error("useWeeklyView must be used within a WeeklyView")
  }
  return context
}

interface WeeklyViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode | ((props: Handles) => React.ReactNode)
}

const WeeklyView = React.forwardRef<HTMLDivElement, WeeklyViewProps>((
  {
    className, children, ...props
  }, ref
) => {
  const timelineRef = React.useRef<HTMLDivElement>(null)
  const eventAreaRef = React.useRef<HTMLDivElement>(null)
  const momentRef = React.useRef<HTMLDivElement>(null)

  const [
    currentDate,
    setCurrentDate,
  ] = React.useState<Date>(new Date())

  const { headerCellStyle } = useScheduler()
  const HEADER_HEIGHT = headerCellStyle.height as number

  const handleAddEvent = React.useCallback(
    (day: Date) => {
      const hourStr = timelineRef?.current?.dataset.time // HH:mm

      if (!hourStr) {
        return day
      }

      const [
        hours,
        minutes,
      ] = hourStr.split(":").map(Number)

      let date = new Date(day)

      date = addHours(
        date, hours
      )
      date = addMinutes(
        date, minutes
      )

      return date
    }, []
  )

  const handleTimelineStyling = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()

      const btn = (e.target as HTMLDivElement).closest(".week-event-area")

      if (!eventAreaRef.current || !btn) {
        return
      }

      const rect = eventAreaRef.current.getBoundingClientRect()
      // không tính toán vùng header
      if (e.clientY <= rect.top + HEADER_HEIGHT) {
        return
      }

      const y = e.clientY - (rect.top + HEADER_HEIGHT)

      const hourHeight = (rect.height - HEADER_HEIGHT) / 24

      const hour = Math.max(
        0, Math.min(
          23, Math.floor(y / hourHeight)
        )
      )
      const minuteFraction = (y % hourHeight) / hourHeight
      const minutes = Math.floor(minuteFraction * 60)

      const time = `${hour.toString().padStart(
        2, "0"
      )}:${minutes.toString().padStart(
        2, "0"
      )}`

      if (timelineRef.current) {
        timelineRef.current.dataset.time = time
        timelineRef.current.style.top = `${y + HEADER_HEIGHT}px`
      }
    }, [HEADER_HEIGHT]
  )

  return (
    <WeeklyViewContext.Provider
      value={
        {
          currentDate,
          setCurrentDate,
          timelineRef,
          eventAreaRef,
          momentRef,
          handles: {
            handleAddEvent,
            handleTimelineStyling,
          },
        }
      }
    >
      <div
        ref={ref}
        className={
          cn(
            "min-w-full table", className
          )
        }
        {...props}
      >
        {
          children instanceof Function
            ? children({
              handleAddEvent,
              handleTimelineStyling,
            })
            : children
        }
      </div>
    </WeeklyViewContext.Provider>
  )
})
WeeklyView.displayName = "WeeklyView"

interface WeekHoursTrackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactElement | ((props: { time: string
    index: number }) => React.ReactElement)
}

const WeekTimesTrack = ({ children }: WeekHoursTrackProps) => {
  return HOURS.map((
    time, index
  ) => (
    <React.Fragment key={index}>
      {
        children instanceof Function
          ? children({
            time,
            index,
          })
          : children
      }
    </React.Fragment>
  ))
}

const WeekTimeCell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    style, ...props
  }, ref
) => {
  const { cellStyle } = useScheduler()

  return (
    <div
      ref={ref}
      style={
        {
          ...cellStyle,
          ...style,
        }
      }
      {...props}
    />
  )
})
WeekTimeCell.displayName = "WeekTimeCell"

interface DayOfWeekTrackProps {
  children: (props: { day: Date
    index: number }) => React.ReactElement
}

const WeekDaysTrack = ({ children }: DayOfWeekTrackProps) => {
  const { getters } = useScheduler()
  const { currentDate } = useWeeklyView()

  const daysOfWeek = React.useMemo(
    () => getters.getDaysInWeek(currentDate), [
      currentDate,
      getters,
    ]
  )

  return daysOfWeek.map((
    day, index
  ) => (
    <React.Fragment key={index}>
      {
        children({
          day,
          index,
        })
      }
    </React.Fragment>
  ))
}

const WeekHeaderCell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    className, style, ...props
  }, ref
) => {
  const { headerCellStyle } = useScheduler()
  return (
    <div
      ref={ref}
      style={
        {
          ...headerCellStyle,
          ...style,
        }
      }
      className={
        cn(
          "border-l p-2 sticky top-0 z-20 bg-muted", className
        )
      }
      {...props}
    />
  )
})
WeekHeaderCell.displayName = "WeekHeaderCell"

const WeekEventArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    className, onMouseMove, onMouseLeave, ...props
  }, ref
) => {
  const {
    eventAreaRef, timelineRef, handles,
  } = useWeeklyView()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseMove = React.useCallback(
    throttle(
      handles.handleTimelineStyling, 100
    ), []
  )

  const handleMouseLeave = React.useCallback(
    () => {
      if (timelineRef.current) {
        timelineRef.current.dataset.time = ""
      }
    }, [timelineRef]
  )

  return (
    <div
      ref={
        mergeRefs(
          ref, eventAreaRef
        )
      }
      onMouseMove={
        chain(
          onMouseMove, handleMouseMove
        )
      }
      onMouseLeave={
        chain(
          onMouseLeave, handleMouseLeave
        )
      }
      className={
        cn(
          "relative week-event-area", className
        )
      }
      {...props}
    />
  )
})
WeekEventArea.displayName = "WeekEventArea"

const WeekTimeLine = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    className, ...props
  }, ref
) => {
  const { timelineRef } = useWeeklyView()

  return (
    <div
      ref={
        mergeRefs(
          ref, timelineRef
        )
      }
      data-time=""
      className={
        cn(
          "pointer-events-none absolute left-0 h-0.5 w-full bg-accent transition-[top] ease-linear data-[time=]:opacity-0", "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:rounded-sm after:bg-primary after:px-1 after:py-0.5 after:text-xs after:text-primary-foreground after:content-[attr(data-time)]", className
        )
      }
      {...props}
    />
  )
})
WeekTimeLine.displayName = "WeekTimeLine"

const WeekMoment = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    className, style, ...props
  }, ref
) => {
  const { momentRef } = useWeeklyView()

  const [time] = React.useState(format(
    new Date(), "HH:mm"
  ))
  const [
    top,
    setTop,
  ] = React.useState(0)
  const {
    cellStyle, headerCellStyle,
  } = useScheduler()

  React.useEffect(
    () => {
      const PER_HOUR_HEIGHT = cellStyle.height as number
      const HEADER_HEIGHT = headerCellStyle.height as number

      const [
        hour,
        minutes,
      ] = time.split(":")
      const top = Number(hour) * PER_HOUR_HEIGHT + (Number(minutes) * PER_HOUR_HEIGHT) / 60 + HEADER_HEIGHT

      setTop(top)
    }, [
      cellStyle.height,
      headerCellStyle.height,
      time,
    ]
  )

  return (
    <div
      ref={
        mergeRefs(
          ref, momentRef
        )
      }
      data-time={time}
      style={
        {
          top,
          ...style,
        }
      }
      className={
        cn(
          "pointer-events-none absolute z-[-1] left-0 h-px border-t-2 w-full border-primary/30 border-dashed transition-[top] ease-linear data-[time=]:opacity-0", "after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:rounded-sm after:bg-secondary after:px-1 after:py-0.5 after:text-xs after:text-primary after:content-[attr(data-time)]", className
        )
      }
      {...props}
    />
  )
})
WeekMoment.displayName = "WeekMoment"

const WeekPrevious = React.forwardRef<HTMLButtonElement, ButtonProps>((
  {
    onClick, ...props
  }, ref
) => {
  const {
    currentDate, setCurrentDate,
  } = useWeeklyView()

  const handlePrevWeek = React.useCallback(
    () => {
      const prevWeek = subDays(
        currentDate, 7
      )
      setCurrentDate(prevWeek)
    }, [
      currentDate,
      setCurrentDate,
    ]
  )

  return (
    <Button
      ref={ref}
      onClick={
        chain(
          onClick, handlePrevWeek
        )
      }
      {...props}
    />
  )
})
WeekPrevious.displayName = "WeekPrevious"

const WeekNext = React.forwardRef<HTMLButtonElement, ButtonProps>((
  {
    onClick, ...props
  }, ref
) => {
  const {
    currentDate, setCurrentDate,
  } = useWeeklyView()

  const handleNextWeek = React.useCallback(
    () => {
      const nextWeek = addDays(
        currentDate, 7
      )
      setCurrentDate(nextWeek)
    }, [
      currentDate,
      setCurrentDate,
    ]
  )

  return (
    <Button
      ref={ref}
      onClick={
        chain(
          onClick, handleNextWeek
        )
      }
      {...props}
    />
  )
})
WeekNext.displayName = "WeekNext"

const WeekScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  {
    className, ...props
  }, ref
) => {
  const innerRef = React.useRef<HTMLDivElement>(null)

  const { momentRef } = useWeeklyView()

  React.useEffect(
    () => {
      if (innerRef.current && momentRef.current) {
        // centerInParent
        const scrollParentToHour = (
          parent: HTMLDivElement, hour: number
        ) => {
          const parentRect = parent.getBoundingClientRect()

          parent.scrollTo({
            top: parent.scrollTop + (parentRect.bottom * hour) / 24,
            behavior: "smooth",
          })
        }

        setTimeout(
          () => {
            scrollParentToHour(
              innerRef.current!, 8
            )
          }, 300
        )
      }
    }, [momentRef]
  )

  return (
    <div
      ref={
        mergeRefs(
          ref, innerRef
        )
      }
      className={
        cn(
          "overflow-auto", className
        )
      }
      {...props}
    />
  )
})
WeekScrollArea.displayName = "WeekScrollArea"

export {
  WeeklyView, WeekEventArea, WeekTimeCell, WeekHeaderCell, WeekTimesTrack, WeekDaysTrack, WeekTimeLine, WeekNext, WeekPrevious, WeekMoment, WeekScrollArea,
}
