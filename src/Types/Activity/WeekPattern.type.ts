import { ActivityValue } from "./ActivityValue.type"

export type WeekPatternGroup = {
    activityType: string,
    weeks: number[],
    activityId: string[],
    recipientId: string,
    timing: ActivityValue[],
    values: ActivityValue[]
}

