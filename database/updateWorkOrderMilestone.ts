import {
  type DateString,
  type TimeString,
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'
import sqlite from 'better-sqlite3'

import { sunriseDB } from '../helpers/database.helpers.js'

export interface UpdateWorkOrderMilestoneForm {
  workOrderMilestoneId: number | string

  workOrderMilestoneDateString: '' | DateString
  workOrderMilestoneDescription: string
  workOrderMilestoneTimeString?: '' | TimeString
  workOrderMilestoneTypeId: number | string
}

export default function updateWorkOrderMilestone(
  milestoneForm: UpdateWorkOrderMilestoneForm,
  user: User
): boolean {
  const database = sqlite(sunriseDB)

  const result = database
    .prepare(
      `update WorkOrderMilestones
        set workOrderMilestoneTypeId = ?,
          workOrderMilestoneDate = ?,
          workOrderMilestoneTime = ?,
          workOrderMilestoneDescription = ?,
          recordUpdate_userName = ?,
          recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?`
    )
    .run(
      milestoneForm.workOrderMilestoneTypeId === ''
        ? undefined
        : milestoneForm.workOrderMilestoneTypeId,
      milestoneForm.workOrderMilestoneDateString === ''
        ? 0
        : dateStringToInteger(milestoneForm.workOrderMilestoneDateString),
      (milestoneForm.workOrderMilestoneTimeString ?? '') === ''
        ? 0
        : timeStringToInteger(
            milestoneForm.workOrderMilestoneTimeString as TimeString
          ),
      milestoneForm.workOrderMilestoneDescription,

      user.userName,
      Date.now(),
      milestoneForm.workOrderMilestoneId
    )

  database.close()

  return result.changes > 0
}
