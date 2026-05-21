export interface Customer {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  contactMethod: "Call" | "Text" | "Email";
  address?: string;
  suite?: string;
  spouse?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone2?: string;
  company?: string;
  rewards: boolean;
  discount?: number;
  type: "Customer" | "Decorator" | "Artist" | "Vendor";
  taxable: boolean;
  taxId?: string;
  notes?: string;
}

export type OrderType = "Framing" | "Photo Services" | "Do at Epps" | "Third Party";
export type Store = "Epps" | "Cedar" | "Web";
export type GlassType =
  | "No Glass"
  | "Conclr"
  | "AR"
  | "Museum"
  | "Regular"
  | "NonGlare"
  | "Plexi"
  | "Plexi-Museum"
  | "Conngl"
  | "Plexi-RC"
  | "Plexi-OP3"
  | "Other";
export type MountingType =
  | "Hinge"
  | "Dry Mount"
  | "Float Mnt"
  | "Sew Down"
  | "Glue Down"
  | "Stretch"
  | "Stretch & Blck"
  | "Gallery Wrap"
  | "Photo Mount"
  | "Museum";

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  orderNumber: string;
  description: string;
  dueDate: string; // ISO date string
  takenDate: string; // ISO date string
  must: boolean;
  type: OrderType;
  store: Store;
  designer: string;
  totalPrice: number;
  codPrice: number;
  itemCount: number;

  // Frame details
  frameSku: string;
  frameNotes: string;
  frameQty: number;
  frameSize: string;
  footage: number;

  // Mat details
  topMat: string;
  secondMat: string;
  thirdMat: string;
  matNotes: string;
  matWidthLessThan: boolean;

  // Glass & Mounting
  glass: GlassType;
  overSize: boolean;
  mounting: MountingType;
  notes: string;

  // Status tracking
  delayed: boolean;
  verified: boolean;
  verifiedDate?: string;
  tabled: boolean;
  tabledDate?: string;
  frameBuilt: boolean;
  frameBuiltDate?: string;
  frameReceived: boolean;
  frameReceivedDate?: string;
  completed: boolean;
  completedDate?: string;
  binLocation?: string;

  // Comments
  comments: OrderComment[];
}

export interface OrderComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface OrdersByDay {
  dayName: string;
  date: string;
  orderCount: number;
  orders: Order[];
}

export interface FrameToOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  frameSku: string;
  frameNotes: string;
  footage: number;
  size: string;
  qty: number;
  vendor: string;
  status: "On List" | "Ordered" | "Received";
  orderedDate?: string;
  receivedDate?: string;
}
