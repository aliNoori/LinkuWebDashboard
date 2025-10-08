export interface Product {
  id: string
  identifier:string
  name: string
  description?: string
  image?: string
  stock:number
  disabled:boolean
  status: 'active' | 'inactive'
}
