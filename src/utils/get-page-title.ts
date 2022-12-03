import { useUserStore } from '@/stores/user'

export const getPageTitle = (pageTitle: string) => {
  const userStore = useUserStore()
  const title = userStore.settings.title || '嘉和美康'
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
