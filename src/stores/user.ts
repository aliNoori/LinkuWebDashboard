import {defineStore} from 'pinia'
import {useRouter} from "vue-router";
import {getCurrentInstance} from "vue";

export interface User {
    id: number
    name: string
    userName:string
    isPro: boolean
    email: string
    phone: string
    emailVerified: boolean
    role: string
    referralCode: string
    referralBy: number
    location: string
    avatar: string
    removeBranding:boolean
    createdAt: typeof Date
    updatedAt: typeof Date
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {} as User,
        fetched: false
    }),

    getters: {
        isUserPro: (state): boolean => !!state.user?.isPro,

    },

    actions: {
        async fetchUser() {
            try {
                //const formStore = useFormStore()
                const {appContext} = getCurrentInstance()!
                const axios = appContext.config.globalProperties.$axios

                const {data} = await axios.get('/user')

                this.user = data.data

                this.fetched = true
            } catch (error) {
                const router = useRouter()
                this.fetched = true
                //await router.push('/auth/login')
                console.error('❌ خطا در دریافت پروفایل:', error)
            }
        },

        clearProfile() {
            this.user = {} as User
        },
    },
})
