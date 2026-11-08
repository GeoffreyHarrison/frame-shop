'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// NOTE: when order create/edit is built, it must create, update or delete MatToOrder
// rows to match Order.topMat / secondMat / thirdMat.

function refresh() {
  revalidatePath('/', 'layout')
}

// "Mat Received" on Mat List
export async function markMatReceived(id: string) {
  await prisma.matToOrder.update({
    where: { id },
    data: { status: 'Received', receivedDate: new Date() },
  })
  refresh()
}

// "Return" on Received Mats — back to Mat List
export async function returnMatToList(id: string) {
  await prisma.matToOrder.update({
    where: { id },
    data: { status: 'On List', receivedDate: null },
  })
  refresh()
}

// "Remove" on Received Mats — soft delete, kept in DB for records (no restore yet)
export async function removeReceivedMat(id: string) {
  await prisma.matToOrder.update({
    where: { id },
    data: { status: 'Removed' },
  })
  refresh()
}

// "Order" toggle on Mat List
export async function setMatOrdered(id: string) {
  await prisma.matToOrder.update({
    where: { id },
    data: { orderedDate: new Date() },
  })
  refresh()
}

export async function clearMatOrdered(id: string) {
  await prisma.matToOrder.update({
    where: { id },
    data: { orderedDate: null },
  })
  refresh()
}
