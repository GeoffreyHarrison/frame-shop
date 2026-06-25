'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function revalidateFramePages() {
  revalidatePath('/frames-to-order')
  revalidatePath('/order-lists/[vendor]', 'page')
  revalidatePath('/', 'layout') // refreshes right sidebar vendor list
}

// "Order" button on Frame List — moves frame to vendor's To Order list
export async function moveFrameToOrderList(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { status: 'Ordered' },
  })
  revalidateFramePages()
}

// "Ordered" button on To Order list — sets orderedDate (called when toggling ON)
export async function setFrameOrderedDate(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { orderedDate: new Date() },
  })
  revalidatePath('/order-lists/[vendor]', 'page')
}

// "Ordered" button on To Order list — clears orderedDate (called when toggling OFF)
export async function clearFrameOrderedDate(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { orderedDate: null },
  })
  revalidatePath('/order-lists/[vendor]', 'page')
}

// "Frame List" button on To Order list — moves frame back to Frame List
export async function moveFrameBackToList(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { status: 'On List', orderedDate: null },
  })
  revalidateFramePages()
}

// "Remove" button on To Order list — hides from all lists, kept in DB
export async function removeFrameFromDisplay(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { status: 'Removed' },
  })
  revalidateFramePages()
}

// "Received" button on Frame List — marks frame as received from vendor
export async function markFrameReceived(frameId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameId },
    data: { status: 'Received', receivedDate: new Date() },
  })
  revalidateFramePages()
}
