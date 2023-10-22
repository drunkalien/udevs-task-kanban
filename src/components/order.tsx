import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Item as ItemType, Order as OrderType } from "./board";

export function Item(props: { item: ItemType }) {
  return (
    <p className="p-1 font-semibold bg-white my-2">
      {props.item.amount} x {props.item.itemName}
    </p>
  );
}

export default function OrderCard(props: { order: OrderType }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardHeader className="justify-between items-center">
          <CardTitle>ID: {props.order.id}</CardTitle>
          <CardDescription>{props.order.totalPrice} сум</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {props.order.items.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
          <div className="flex justify-end text-sm text-muted-foreground">
            {props.order.time}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
