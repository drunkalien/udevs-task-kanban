import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import OrderCard from "./order";
import { Order, OrderStatus } from "./board";

type Props = {
  id: OrderStatus;
  orders: Order[];
  title: "Новый" | "Заготовка" | "Готов" | "Курьер в пути";
  color: "yellow" | "blue" | "green" | "teal";
};

export default function Container(props: Props) {
  const { id, orders, color } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  const orderIds = orders.map((order) => order.id);

  return (
    <SortableContext
      id={id}
      items={orderIds}
      strategy={verticalListSortingStrategy}
    >
      <div
        className="bg-slate-50 my-4 rounded-lg max-w-md w-full"
        ref={setNodeRef}
      >
        <div>
          <div
            className={` p-3 text-xl text-white font-semibold rounded-t-lg bg-${color}`}
          >
            <h3>
              {props.title} ({props.orders.length})
            </h3>
          </div>
          <div className="p-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </SortableContext>
  );
}
