import React, { useMemo } from 'react'
import moment from 'moment'
import {Calendar, momentLocalizer, Views} from '../../src'
import demoEvents from '../resources/events'
import mdx from './formatsWeekdayFormat.mdx'

const mLocalizer = momentLocalizer(moment)

export default {
  title: 'props',
  component: Calendar,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}

export function FormatsWeekdayFormat() {
  const { defaultDate, formats } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 12),
      formats: {
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd', culture),
      },
    }),
    []
  )

  return (
    <div className="height600">
      <Calendar
        defaultView={Views.WEEK}
        defaultDate={defaultDate}
        events={demoEvents}
        formats={formats}
        localizer={mLocalizer}
        components={{
          week: {
            showMoreProps: {
              closeButtonText: 'Close!',
              popupStyleClass: 'show-more'
            }
          }
        }}
        popup
      />
    </div>
  )
}
FormatsWeekdayFormat.storyName = 'formats.weekdayFormat'
