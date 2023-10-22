import { Order } from "./components/board";

export const mockOrders: Order[] = [
  {
    id: "123453",
    items: [
      { amount: 1, id: 1, itemName: "test", price: 100, time: "2021-10-10" },
      { amount: 1, id: 2, itemName: "test", price: 100, time: "2021-10-10" },
    ],
    comments: [{ id: 1, comment: "test" }],
    totalPrice: 100,
    time: "13:00",
    isAccepted: false,
  },
  {
    id: "123456",
    items: [
      { amount: 1, id: 3, itemName: "test", price: 100, time: "2021-10-10" },
      { amount: 1, id: 4, itemName: "test", price: 100, time: "2021-10-10" },
    ],
    comments: [{ id: 2, comment: "test" }],
    totalPrice: 100,
    time: "14:00",
    isAccepted: false,
  },
];
