export interface ColumnType {
  id?: string;
  name: string;
  tasks: TaskType[];
}

export interface BoardType {
  id: string;
  name: string;
  isActive: boolean;
}

export interface TaskType {
  id?: string;
  title: string;
  status: string;
  description: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface SingleColumn {
  id: string;
  title: string;
  cards: Card[];
}

export interface GraphQLResponse {
  allColumns: SingleColumn[];
}
