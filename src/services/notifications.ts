import { reload } from '@/services/store'

export const handlers = {
    catalog: {
        update: () => {
            reload();
        }
    }
}