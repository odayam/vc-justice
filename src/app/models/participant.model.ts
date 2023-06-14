import { User } from "./user.model";

export interface Participant {
    connectionId: string;
    user: User;
    isCurrent: boolean;
  }