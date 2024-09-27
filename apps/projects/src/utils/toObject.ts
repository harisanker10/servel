export type ToObject<T> = Omit<T, '_id'> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
