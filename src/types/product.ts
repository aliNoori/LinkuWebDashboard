export interface Product {
  id: string
  name: string
  description?: string
  image?: string
  status: 'active' | 'inactive'
}
