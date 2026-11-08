'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type StatusType = 'verified' | 'tabled' | 'built' | 'completed' | 'pickedUp' | 'mustHave' | 'delayed'

const statusFieldMap: Record<StatusType, string> = {
  verified: 'verifiedAt',
  tabled: 'tabledAt',
  built: 'builtAt',
  completed: 'completedAt',
  pickedUp: 'pickedUpAt',
  mustHave: 'mustHaveStatus',
  delayed: 'delayedStatus',
}

export async function updateOrderStatus(orderId: string, status: StatusType) {
  const statusField = statusFieldMap[status]
  if (!statusField) {
    throw new Error(`Invalid status type: ${status}`)
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { [statusField]: new Date() },
    include: { customer: true },
  })

  // Status lives on many pages (daily detail, order lists, binventory, ...) — refresh them all
  revalidatePath('/', 'layout')

  return updated
}

export async function clearOrderStatus(orderId: string, status: StatusType) {
  const statusField = statusFieldMap[status]
  if (!statusField) {
    throw new Error(`Invalid status type: ${status}`)
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { [statusField]: null },
    include: { customer: true },
  })

  // Status lives on many pages (daily detail, order lists, binventory, ...) — refresh them all
  revalidatePath('/', 'layout')

  return updated
}

export async function updateBinLocation(orderId: string, binLetter: string) {
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { binLocation: binLetter },
    include: { customer: true },
  })

  revalidatePath('/', 'layout')

  return updated
}
