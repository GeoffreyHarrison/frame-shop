'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CustomerFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  contactMethod: 'Call' | 'Text' | 'Email'
  phone2?: string
  address?: string
  suite?: string
  city?: string
  state?: string
  zip?: string
  spouse?: string
  company?: string
  type?: 'Customer' | 'Decorator' | 'Artist' | 'Vendor'
  rewards?: boolean
  discount?: number
  taxable?: boolean
  taxId?: string
  notes?: string
}

export async function createCustomer(data: CustomerFormData): Promise<{ id: string }> {
  const customer = await prisma.customer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email ?? '',
      contactMethod: data.contactMethod,
      secondPhone: data.phone2 ?? null,
      address: data.address ?? '',
      suite: data.suite ?? null,
      city: data.city ?? '',
      state: data.state ?? '',
      zip: data.zip ?? '',
      spouse: data.spouse ?? null,
      company: data.company ?? null,
      type: data.type ?? 'Customer',
      rewards: data.rewards ?? false,
      discount: data.discount ?? 0,
      taxable: data.taxable ?? true,
      taxId: data.taxId ?? null,
      notes: data.notes ?? null,
    },
  })
  revalidatePath('/customers')
  return { id: customer.id }
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  await prisma.customer.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email ?? '',
      contactMethod: data.contactMethod,
      secondPhone: data.phone2 ?? null,
      address: data.address ?? '',
      suite: data.suite ?? null,
      city: data.city ?? '',
      state: data.state ?? '',
      zip: data.zip ?? '',
      spouse: data.spouse ?? null,
      company: data.company ?? null,
      type: data.type ?? 'Customer',
      rewards: data.rewards ?? false,
      discount: data.discount ?? 0,
      taxable: data.taxable ?? true,
      taxId: data.taxId ?? null,
      notes: data.notes ?? null,
    },
  })
  revalidatePath(`/customers/${id}`)
  revalidatePath('/customers')
  redirect(`/customers/${id}`)
}
