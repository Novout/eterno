import { format } from 'date-fns'

export const useDate = () => {
  const getCommonDate = (date?: Date) => {
    return format(date || new Date(), 'MM/dd/yyyy h:mm a')
  }

  return { getCommonDate }
}
