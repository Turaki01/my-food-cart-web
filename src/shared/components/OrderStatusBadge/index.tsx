import { Badge } from '@shared/components/Badge'
import type { OrderStatus } from '@shared/types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: 'Confirmed',
  being_picked: 'Being picked',
  on_the_way: 'On the way',
  delivered: 'Delivered',
}

const STATUS_VARIANT: Record<OrderStatus, 'gray' | 'amber' | 'green'> = {
  confirmed: 'gray',
  being_picked: 'amber',
  on_the_way: 'amber',
  delivered: 'green',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}
