import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRevalidator } from "react-router";
import { storage } from "~/lib/storage/storage";
import RuleViewButton from "./rule-view-button";

function SortableItem({ rule }: { rule: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none select-none cursor-grab"
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ type: "tween", ease: "circOut", duration: 0.2 }}
      >
        <RuleViewButton rule={rule} />
      </motion.div>
    </div>
  );
}

export function RulesViewSortable({
  rules,
  reorder,
}: {
  rules: any[];
  reorder: any;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const revalidator = useRevalidator();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    reorder(active.id as string, over.id as string);
    try {
      const oldIndex = rules.findIndex((r) => r.id === active.id);
      const newIndex = rules.findIndex((r) => r.id === over.id);
      const newOrderList = arrayMove(rules, oldIndex, newIndex);
      await storage.reorderRules(newOrderList.map((r) => r.id));
      revalidator.revalidate();
    } catch (error) {
      revalidator.revalidate();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
        <SortableContext items={rules} strategy={rectSortingStrategy}>
          <AnimatePresence>
            {rules.map((rule) => (
              <SortableItem key={rule.id} rule={rule} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
          }),
        }}
      >
        {activeId ? (
          <div className="scale-105 shadow-2xl cursor-grabbing rounded-lg border bg-background overflow-hidden">
            <RuleViewButton rule={rules.find((r) => r.id === activeId)} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
