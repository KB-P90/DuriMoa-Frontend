import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import type { FloatingCoordinates, FloatingCorner, UseLongPressDragOptions } from '@/types/aiChat';

const DEFAULT_LONG_PRESS_DELAY = 45;
const DEFAULT_MOVEMENT_TOLERANCE = 8;
const CLICK_SUPPRESSION_DELAY = 400;

function distanceBetween(start: FloatingCoordinates, current: FloatingCoordinates) {
  return Math.hypot(current.x - start.x, current.y - start.y);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function initialCoordinates(
  corner: FloatingCorner,
  boundary: DOMRect,
  target: DOMRect
): FloatingCoordinates {
  return {
    x: corner.endsWith('right') ? boundary.width - target.width : 0,
    y: corner.startsWith('bottom') ? boundary.height - target.height : 0,
  };
}

export function useLongPressDrag({
  target,
  boundary,
  initialPosition,
  longPressDelay = DEFAULT_LONG_PRESS_DELAY,
  movementTolerance = DEFAULT_MOVEMENT_TOLERANCE,
  onActivate,
}: UseLongPressDragOptions) {
  const position = ref<FloatingCoordinates>({ x: 0, y: 0 });
  const isDragging = ref(false);
  const isPositionReady = ref(false);

  let activePointerId: number | null = null;
  let pressStart: FloatingCoordinates | null = null;
  let positionAtPressStart: FloatingCoordinates | null = null;
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let clickSuppressionTimer: ReturnType<typeof setTimeout> | null = null;
  let suppressNextClick = false;
  let hasMoved = false;

  const positionStyle = computed(() => ({
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
  }));

  function clearLongPressTimer() {
    if (longPressTimer === null) return;
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  function clearClickSuppressionTimer() {
    if (clickSuppressionTimer === null) return;
    clearTimeout(clickSuppressionTimer);
    clickSuppressionTimer = null;
  }

  function getClampedPosition(coordinates: FloatingCoordinates) {
    const boundaryElement = boundary.value;
    const targetElement = target.value;
    if (!boundaryElement || !targetElement) return coordinates;

    const boundaryRect = boundaryElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    return {
      x: clamp(coordinates.x, 0, boundaryRect.width - targetRect.width),
      y: clamp(coordinates.y, 0, boundaryRect.height - targetRect.height),
    };
  }

  function setInitialPosition() {
    const boundaryElement = boundary.value;
    const targetElement = target.value;
    if (!boundaryElement || !targetElement) return;

    position.value = initialCoordinates(
      initialPosition,
      boundaryElement.getBoundingClientRect(),
      targetElement.getBoundingClientRect()
    );
    isPositionReady.value = true;
  }

  function handleViewportResize() {
    if (!hasMoved) {
      setInitialPosition();
      return;
    }

    position.value = getClampedPosition(position.value);
  }

  function scheduleClickSuppressionReset() {
    clearClickSuppressionTimer();
    clickSuppressionTimer = setTimeout(() => {
      suppressNextClick = false;
      clickSuppressionTimer = null;
    }, CLICK_SUPPRESSION_DELAY);
  }

  function resetPointerState() {
    clearLongPressTimer();
    activePointerId = null;
    pressStart = null;
    positionAtPressStart = null;
    isDragging.value = false;
  }

  function handlePointerDown(event: PointerEvent) {
    if (
      !event.isPrimary ||
      activePointerId !== null ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return;
    }

    const targetElement = target.value;
    if (!targetElement) return;

    activePointerId = event.pointerId;
    pressStart = { x: event.clientX, y: event.clientY };
    positionAtPressStart = { ...position.value };
    suppressNextClick = false;
    clearClickSuppressionTimer();
    targetElement.setPointerCapture(event.pointerId);

    longPressTimer = setTimeout(() => {
      if (activePointerId !== event.pointerId) return;
      isDragging.value = true;
      suppressNextClick = true;
      longPressTimer = null;
    }, longPressDelay);
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerId !== activePointerId || !pressStart || !positionAtPressStart) {
      return;
    }

    const current = { x: event.clientX, y: event.clientY };
    const movementDistance = distanceBetween(pressStart, current);

    if (!isDragging.value) {
      if (movementDistance > movementTolerance) {
        clearLongPressTimer();
        suppressNextClick = true;
      }
      return;
    }

    event.preventDefault();
    hasMoved = true;
    position.value = getClampedPosition({
      x: positionAtPressStart.x + current.x - pressStart.x,
      y: positionAtPressStart.y + current.y - pressStart.y,
    });
  }

  function finishPointerInteraction(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return;

    const targetElement = target.value;
    const shouldSuppressClick = suppressNextClick;

    if (isDragging.value) {
      position.value = getClampedPosition(position.value);
    }

    resetPointerState();

    if (targetElement?.hasPointerCapture(event.pointerId)) {
      targetElement.releasePointerCapture(event.pointerId);
    }

    if (shouldSuppressClick) scheduleClickSuppressionReset();
  }

  function handleLostPointerCapture(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return;
    const shouldSuppressClick = suppressNextClick;
    resetPointerState();
    if (shouldSuppressClick) scheduleClickSuppressionReset();
  }

  function handleClick(event: MouseEvent) {
    if (suppressNextClick && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
      clearClickSuppressionTimer();
      return;
    }

    suppressNextClick = false;
    clearClickSuppressionTimer();
    onActivate();
  }

  onMounted(() => {
    void nextTick(setInitialPosition);
    window.addEventListener('resize', handleViewportResize);
  });

  onBeforeUnmount(() => {
    clearLongPressTimer();
    clearClickSuppressionTimer();
    window.removeEventListener('resize', handleViewportResize);

    if (activePointerId !== null && target.value?.hasPointerCapture(activePointerId)) {
      target.value.releasePointerCapture(activePointerId);
    }

    resetPointerState();
  });

  return {
    handleClick,
    handleLostPointerCapture,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointerInteraction,
    handlePointerCancel: finishPointerInteraction,
    isDragging,
    isPositionReady,
    positionStyle,
  };
}
