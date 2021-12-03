
import { Project } from '../Types';

export const PROJECTS: Project[] = [{
  id: "project id 1",
  name: "project name 1",
  createdAt: Date.now(),
  firstSprintStartAt: "",
  cycle: 100 * 60 * 1000,
  description: "description for project 1",
  members: ["user id 1"],
}, {
  id: "project id 2",
  name: "project name 2",
  createdAt: Date.now(),
  firstSprintStartAt: "",
  cycle: 200 * 60 * 1000,
  description: "description for project 2",
  members: [],
}, {
  id: "project id 3",
  name: "project name 3",
  createdAt: Date.now(),
  firstSprintStartAt: "",
  cycle: 300 * 60 * 1000,
  description: "description for project 3",
  members: [],
}, {
  id: "project id 4",
  name: "project name 4",
  createdAt: Date.now(),
  firstSprintStartAt: "",
  cycle: 400 * 60 * 1000,
  description: "description for project 4",
  members: [],
}, ];
