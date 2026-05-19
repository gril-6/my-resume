import type { ComponentSchema, GuideLine, Rect } from '@/types/schema';

interface SnapResult {
  rect: Rect;
  guideLines: GuideLine[];
}

const SNAP_THRESHOLD = 6;

const getAxisPoints = (rect: Rect): { vertical: number[]; horizontal: number[] } => ({
  vertical: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
  horizontal: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
});

export const calculateSnap = (moving: Rect, siblings: ComponentSchema[]): SnapResult => {
  const movingPoints = getAxisPoints(moving);
  let offsetX = 0;
  let offsetY = 0;
  const guideLines: GuideLine[] = [];

  siblings.forEach((item) => {
    const target = item.style;
    const targetPoints = getAxisPoints(target);

    targetPoints.vertical.forEach((targetPoint) => {
      movingPoints.vertical.forEach((movingPoint) => {
        const diff = targetPoint - movingPoint;
        if (Math.abs(diff) <= SNAP_THRESHOLD && Math.abs(diff) > Math.abs(offsetX)) {
          offsetX = diff;
          guideLines.push({ type: 'vertical', position: targetPoint });
        }
      });
    });

    targetPoints.horizontal.forEach((targetPoint) => {
      movingPoints.horizontal.forEach((movingPoint) => {
        const diff = targetPoint - movingPoint;
        if (Math.abs(diff) <= SNAP_THRESHOLD && Math.abs(diff) > Math.abs(offsetY)) {
          offsetY = diff;
          guideLines.push({ type: 'horizontal', position: targetPoint });
        }
      });
    });
  });

  return {
    rect: {
      ...moving,
      x: moving.x + offsetX,
      y: moving.y + offsetY,
    },
    guideLines: guideLines.slice(-2),
  };
};
