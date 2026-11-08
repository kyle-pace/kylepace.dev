// Where a project stands. Shown as a badge on the home page.
export const statuses = ['in-progress', 'published'] as const;
export type Status = (typeof statuses)[number];

export const statusLabels: Record<Status, string> = {
  'in-progress': 'In progress',
  published: 'Published',
};
