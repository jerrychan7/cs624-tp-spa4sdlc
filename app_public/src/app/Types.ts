
// Card <--1:n--> Card
// Board <--1:n--> Card
// Project <--1:n--> Board
// User <--m:n--> Project

type ID = string;
type Timestamp = number; // millisecond base
type DateTime = Date | string; // UTC time ISO 8601
interface Record {
    createdAt?: Timestamp,
    updatedAt?: Timestamp,
};

export const enum CardStatus {
  STOP = 'Stop',
  DOING = 'Doing',
  DONE = 'Done',
};
export interface Card extends Record {
  id: ID,
  boardId: ID,
  board?: Board,
  belongCardID?: ID,
  title: string,
  subTitle?: string,
  content?: string,
  totalTime: Timestamp,
  currentDuration: Timestamp,
  status: CardStatus,
  lastActivityAt: Timestamp,
};

export const enum BoardCategory {
  PRODUCT = 'Product',
  SPRINT = 'Sprint',
};
export interface Board extends Record {
  id: ID,
  name: string,
  category: BoardCategory,
  cycle?: Timestamp,  // record sprint cycle length
  description?: string,
  projectId: ID,
  project?: Project,
  cards?: Card[],
  langs?: any,
};

export interface User extends Record {
  id: ID,
  username: string,
  email: string,
  email_verified: boolean,
  projects?: Project[],
};

export interface Project extends Record {
  id: ID,
  name: string,
  firstSprintStartAt: DateTime,
  cycle: Timestamp,
  description?: string,
  members?: Array<User | ID | any>,
  boards?: Board[],
};

// SprintRecord <--1:n--> DayHistory <--1:n--> DayHistoryReport
export interface SprintRecord extends Record {
  id: ID,
  sprintId: ID,
  daysHistory: DayHistory[],
};
export interface DayHistory extends Record {
  date: DateTime,
  actualEffort: Timestamp,
  reports?: DayHistoryReport[],
};
export interface DayHistoryReport extends Record {
  userId: ID,
  title?: string,
  content: string,
};
