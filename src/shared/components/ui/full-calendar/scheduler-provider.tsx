/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import React, {
  createContext, type CSSProperties, type ReactNode, useCallback, useContext,
} from "react"

import {
  addDays, eachDayOfInterval, endOfWeek, getWeek, isSameDay, startOfWeek, type Day,
} from "date-fns"

// Config
const PER_HOUR_HEIGHT = 64 // 64px
const HEADER_HEIGHT = 56 // 56px
const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const

interface Getters {
  getDaysInWeek: (date: Date) => Date[]
  getEventsForDay: <T>(day: Date, events: T[]) => T[]
  getWeekNumber: (date: Date) => number
}

interface Handlers {
  handleEventStyling: <T>(event: T, events: T[]) => CSSProperties | undefined
}

interface SchedulerContextProps {
  cellStyle: CSSProperties
  headerCellStyle: CSSProperties
  getters: Getters
  handlers: Handlers
  weekStartsOn: Day
}

// Create the context with the correct type
const SchedulerContext = createContext<SchedulerContextProps | null>(null)

export function useScheduler() {
  const context = useContext(SchedulerContext)
  if (!context) {
    throw new Error("useScheduler must be used within a SchedulerProvider")
  }
  return context
}

type RangeDate = {
  from: Date
  to: Date
}

type FieldNames = Record<keyof RangeDate, string>

interface SchedulerProviderProps {
  children: ReactNode
  weekStartsOn?: (typeof WEEKDAYS)[number]
  fieldNames?: FieldNames
  perHourHeight?: number
  headerHeight?: number
}

const DefaultFieldNames: FieldNames = {
  from: "from",
  to: "to",
}

// Provider component
export const SchedulerProvider = ({
  children, weekStartsOn: weekStartsOnProp = "Sun", fieldNames = DefaultFieldNames, perHourHeight = PER_HOUR_HEIGHT, headerHeight = HEADER_HEIGHT,
}: SchedulerProviderProps) => {
  const weekStartsOn = WEEKDAYS.findIndex(it => it === weekStartsOnProp) as Day

  // global getters
  const getDaysInWeek = useCallback(
    (date: Date) => {
      const days = eachDayOfInterval({
        start: startOfWeek(
          date, {
            weekStartsOn,
          }
        ),
        end: endOfWeek(
          date, {
            weekStartsOn,
          }
        ),
      })
      return days
    },
    [weekStartsOn]
  )

  const getWeekNumber = useCallback(
    (date: Date) => {
      return getWeek(
        date, {
          weekStartsOn,
        }
      )
    },
    [weekStartsOn]
  )

  // util
  const getStartEndDate = useCallback(
    function <T>(inValue: T) {
      const value = inValue as Record<string, unknown>
      if (
        value?.[fieldNames.from]
        && value?.[fieldNames.to]
        && value[fieldNames.from] instanceof Date
        && value[fieldNames.to] instanceof Date
      ) {
        return {
          from: value[fieldNames.from],
          to: value[fieldNames.to],
        } as RangeDate
      }
      // eslint-disable-next-line no-console
      console.log("Error start/end date not type of Date")
    },
    [fieldNames]
  )

  // Helper function to filter events for a specific day
  const getEventsForDay = useCallback(
    function <T>(
      day: Date, events: T[]
    ) {
      const startOfDay = day
      const endOfDay = addDays(
        startOfDay, 1
      )

      const dayEvents = events.filter((evt) => {
        const e = getStartEndDate(evt)

        if (e) {
          const isSame = isSameDay(
            e.from, startOfDay
          )
          const isSpanningDay = e.from < endOfDay && e.to >= startOfDay

          return isSame || isSpanningDay
        }
        return false
      })

      return dayEvents
    },
    [getStartEndDate]
  )

  // handlers
  const handleEventStyling = useCallback(
    function <T>(
      inEvent: T, events: T[]
    ) {
      const event = getStartEndDate(inEvent)

      if (event) {
        const eventsOnHour = events.filter((evt) => {
          const e = getStartEndDate(evt)
          if (e) {
            return (
              e.from < event.to && e.to > event.from // Any overlap
            )
          }
          return false
        })

        const numEventsOnHour = eventsOnHour.length || 1
        const _indexOnHour = eventsOnHour.findIndex((evt) => {
          const e = getStartEndDate(evt)
          if (e) {
            return (
              e.from === event.from && e.to === event.to // Any overlap
            )
          }
          return false
        })
        const indexOnHour = _indexOnHour < 0 ? 0 : _indexOnHour

        let eventHeight = 0
        let maxHeight = 0
        let eventTop = 0

        // Normalize start and end dates to only include hours and minutes
        const startTime = event.from.getHours() * 60 + event.from.getMinutes() // Convert to minutes
        const endTime = event.to.getHours() * 60 + event.to.getMinutes() // Convert to minutes

        // Calculate the difference in minutes between start and end times
        const diffInMinutes = endTime - startTime

        // Calculate the event height based on the duration (64px per hour, so 64px/60min = 1.0667px per minute)
        // eventHeight = (diffInMinutes / 60) * 64
        eventHeight = (diffInMinutes / 60) * perHourHeight
        // console.log("eventHeight", eventHeight);
        // Get the event start hour as a fraction (e.g., 13.5 for 13:30)
        const eventStartHour = event.from.getHours() + event.from.getMinutes() / 60

        // Define the day-end hour (24.0 for midnight)
        const dayEndHour = 24

        // Calculate maxHeight based on the difference between the day-end hour and the event's start hour
        maxHeight = Math.max(
          0, (dayEndHour - eventStartHour) * perHourHeight
        )

        // Limit the event height to the calculated maxHeight (so it doesn’t overflow beyond the day)
        eventHeight = Math.min(
          eventHeight, maxHeight
        )

        // Calculate the top position based on the event's start time (64px per hour)
        eventTop = eventStartHour * perHourHeight + headerHeight

        return {
          height: `${eventHeight < 10 ? 20 : eventHeight > maxHeight ? maxHeight : eventHeight}px`,
          top: `${eventTop}px`,
          zIndex: indexOnHour + 1,
          left: `${(indexOnHour * 100) / numEventsOnHour}%`,
          width: `${100 / numEventsOnHour}%`,
        } as CSSProperties
      }
      // eslint-disable-next-line no-console
      console.error("Invalid event or missing start/end dates.")
    },
    [getStartEndDate]
  )

  return (
    <SchedulerContext.Provider
      value={
        {
          cellStyle: {
            height: perHourHeight,
          },
          headerCellStyle: {
            height: headerHeight,
          },
          getters: {
            getDaysInWeek,
            getEventsForDay,
            getWeekNumber,
          },
          handlers: {
            handleEventStyling,
          },
          weekStartsOn,
        }
      }
    >
      {children}
    </SchedulerContext.Provider>
  )
}
