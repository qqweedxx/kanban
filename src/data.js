export const initialColumns = [
  {
    id: 'todo',
    title: 'To Do',
    wipLimit: null,
    cards: [
      { id: 'c1', title: 'Купить хлеб' },
      { id: 'c2', title: 'Позвонить маме' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    wipLimit: 3,
    cards: [{ id: 'c3', title: 'Доделать лабораторную' }],
  },
  {
    id: 'done',
    title: 'Done',
    wipLimit: null,
    cards: [],
  },
]