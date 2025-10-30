import {defineStore} from 'pinia'
import {computed, getCurrentInstance, ref} from 'vue'
import {useRouter} from 'vue-router'

export interface User {
    id: number
    name: string
    userName: string
    isPro: boolean
    email: string
    phone: string
    emailVerified: boolean
    role: string
    referralCode: string
    referralBy: number
    location: string
    avatar: string
    status: string
    removeBranding: boolean
    createdAt: typeof Date
    updatedAt: typeof Date
}

export interface Admin {
    id: number
    firstName: string
    lastName: string
    fullName: string
    username: string
    phone: string
    countryCode: string
    email: string
    password?: string
    status: 'active' | 'inactive'
    createdAt: string
}

export const useUserStore = defineStore('userStore', () => {
    const user = ref<User>({} as User)
    const users = ref<User[]>([])
    const admins = ref<Admin[]>([])
    const fetched = ref(false)
    const router = useRouter()

    const isUserPro = () => !!user.value?.isPro

    const {appContext} = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/user')
            user.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت پروفایل:', error)
            // await router.push('/auth/login') // فعال‌سازی در صورت نیاز
        }
    }
    const fetchAdminUser = async () => {
        try {
            const {data} = await axios.get('/user/admin')
            admins.value = data.data
            fetched.value = true
        } catch (error) {
            fetched.value = true
            console.error('❌ خطا در دریافت پروفایل:', error)
            // await router.push('/auth/login') // فعال‌سازی در صورت نیاز
        }
    }
    const createAdminUser = async (adminForm: Admin) => {
        try {
            const {data} = await axios.post('/user/admin/addAdmin', adminForm)
            user.value = data.data

        } catch (error: any) {
            console.error('❌ خطا در ایجاد ادمین:', error)
        }
    }
    const updateAdminUser = async (id: number, payload: Partial<Admin>) => {
        try {
            const {data} = await axios.put(`/user/admin/${id}`, payload)
            const index = admins.value.findIndex(a => a.id === id)
            if (index !== -1) admins.value[index] = data.data
            return data.data
        } catch (error) {
            console.error('❌ خطا در ویرایش ادمین:', error)
            throw error
        }
    }
    const deleteAdminUser = async (id: number) => {
        try {
            await axios.delete(`/user/admin/${id}`)
            admins.value = admins.value.filter(admin => admin.id !== id)
            console.log(`✅ ادمین با شناسه ${id} حذف شد`)
        } catch (error) {
            console.error('❌ خطا در حذف ادمین:', error)
            throw error
        }
    }
    const fetchAllUsers = async () => {
        try {
            const {data} = await axios.get('user/admin/userList')
            users.value = data.data
        } catch (error) {
            console.error('❌ خطا در دریافت لیست کاربران:', error)
        }
    }
    const totalUsers = computed(() => users.value.length)
    const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
    const suspendedUsers = computed(() => users.value.filter(u => u.status === 'suspended').length)
    const inactiveUsers = computed(() => users.value.filter(u => u.status === 'inactive').length)
    const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length)
    const activeAdmins = computed(() => users.value.filter(u => u.role === 'admin' && u.status === 'active').length)

    const clearProfile = () => {
        user.value = {} as User
    }

    return {
        user,
        admins,
        users,
        fetched,

        totalUsers,
        activeUsers,
        suspendedUsers,
        inactiveUsers,
        adminUsers,
        activeAdmins,

        fetchUser,
        fetchAllUsers,
        fetchAdminUser,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        clearProfile
    }
})
