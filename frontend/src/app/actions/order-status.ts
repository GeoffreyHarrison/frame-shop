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

  // Revalidate order detail page and related pages
  revalidatePath(`/framing-orders`)
  revalidatePath(`/framing-orders/[date]`, 'layout')
  revalidatePath(`/framing-orders/[date]/[orderId]`, 'layout')

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

  // Revalidate order detail page and related pages
  revalidatePath(`/framing-orders`)
  revalidatePath(`/framing-orders/[date]`, 'layout')
  revalidatePath(`/framing-orders/[date]/[orderId]`, 'layout')

  return updated
}

export async function getOrdersReadyForFrameBuild() {
  // Ready to build = frame received (FrameToOrder.receivedDate set) AND verified, but not yet built
  return await prisma.order.findMany({
    where: {
      verifiedAt: { not: null },
      builtAt: null,
      frameToOrder: {
        receivedDate: { not: null },
      },
    },
    include: { customer: true, frameToOrder: true },
    orderBy: { dueDate: 'asc' },
  })
}

export async function updateBinLocation(orderId: string, binLetter: string) {
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { binLocation: binLetter },
    include: { customer: true },
  })

  // Revalidate related pages
  revalidatePath(`/framing-orders/[date]/[orderId]`, 'layout')

  return updated
}
