import {defineStore} from 'pinia'
import {useRouter} from "vue-router";
import {getCurrentInstance} from "vue";
//import type {CardItem} from "~/stores/form";

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
    //cardsDataList?: CardItem[]
    createdAt: typeof Date
    updatedAt: typeof Date
}

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {} as User,
        //cards: [] as CardItem[],
        fetched: false
    }),

    getters: {
        isUserPro: (state): boolean => !!state.user?.isPro,
        //cardCount: (state): number => state.cards.length,
    },

    actions: {
        async fetchUser() {
            try {
                //const formStore = useFormStore()
                const {appContext} = getCurrentInstance()!
                const axios = appContext.config.globalProperties.$axios

                const {data} = await axios.get('/user')

                this.user = data.data
                //this.cards = this.user?.cardsDataList || []
                /*this.activeCard = this.cards.find((c:CardItem) => c.isDefault) || null*/
                //formStore.cards = this.cards

                this.fetched = true
            } catch (error) {
                const router = useRouter()
                this.fetched = true
                //await router.push('/auth/login')
                console.error('❌ خطا در دریافت پروفایل:', error)
            }
        },
        setActiveCard(cardId: string) {
            /*this.activeCard = this.cards.find((c:CardItem) => c.id === cardId) || null*/
        },

        clearProfile() {
            this.user = {} as User
            //this.cards = []
            /*this.activeCard = null*/
        },
    },
})
