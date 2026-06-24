'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function markFrameOrdered(frameToOrderId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameToOrderId },
    data: {
      orderedDate: new Date(),
      status: 'Ordered',
    },
  })
  revalidatePath('/order-lists/[vendor]', 'page')
  revalidatePath('/frames-to-order')
}

export async function removeFrameFromOrderList(frameToOrderId: string) {
  await prisma.frameToOrder.update({
    where: { id: frameToOrderId },
    data: {
      status: 'On List',
      orderedDate: null,
    },
  })
  revalidatePath('/order-lists/[vendor]', 'page')
  revalidatePath('/frames-to-order')
}
