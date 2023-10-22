import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "@/components/container";
import { Item } from "@/components/order";
import OrderCard from "./order";
import { mockOrders } from "@/mock-orders";

export type OrderStatus = "new" | "prep" | "ready" | "delivering";

export type Item = {
  id: number;
  itemName: string;
  price: number;
  amount: number;
  time: string;
};

export type Comment = {
  id: number;
  comment: string;
};

export type Order = {
  id: string;
  totalPrice: number;
  items: Item[];
  comments: Comment[];
  time: string;
  isAccepted: boolean;
};

export default function Board() {
  const [items, setItems] = useState<Record<OrderStatus, Order[]>>({
    new: mockOrders,
    prep: [],
    ready: [],
    delivering: [],
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="flex gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Container id="new" orders={items.new} title="Новый" color="blue" />
        <Container
          id="prep"
          orders={items.prep}
          title="Заготовка"
          color="yellow"
        />
        <Container
          id="ready"
          orders={items.ready}
          title="Готов"
          color="green"
        />
        <Container
          id="delivering"
          orders={items.delivering}
          title="Курьер в пути"
          color="teal"
        />
        <DragOverlay>
          {activeId && findOrder(activeId)!.isAccepted ? (
            <OrderCard order={findOrder(activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function findOrder(activeId: string) {
    return Object.keys(items).reduce((result, key) => {
      const found = items[key as keyof typeof items].find(
        (item) => item.id === activeId
      );

      if (found) {
        return found;
      }

      return result;
    }, null as Order | null);
  }

  function findContainer(id: string): OrderStatus {
    if (id in items) {
      return id as OrderStatus;
    }

    return Object.keys(items).find((key) =>
      items[key as keyof typeof items].some((item) => item.id === id)
    ) as OrderStatus;
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id ?? "";

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const order = activeItems.find((order) => order.id === id);
      const overOrder = overItems.find((order) => order.id === overId);
      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        ({ id: orderId }) => orderId === order?.id
      );
      const overIndex = overItems.findIndex(
        ({ id: overId }) => overId === overOrder?.id
      );

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const { id } = active;
    const overId = over?.id ?? "";

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].findIndex(
      (item) => item.id === active.id
    );
    const overIndex = items[overContainer].findIndex(
      (item) => item.id === over?.id
    );

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  }
}
