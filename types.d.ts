type Role = "HR" | "EMPLOYEE";
type Status = "PENDING" | "ACCEPT" | "REJECT";

type ImageT = {
  url: string;
  path: string;
};

type Position = {
  _id: string;
  title: string;
};

type User = {
  _id: string;
  fullname: string;
  username: string;
  monthlyLimit: number;
  image: ImageT;
  position: Position;
  role: Role;
};

type Imprest = {
  _id: string;
  amount: number;
  message?: string;
  status: Status;
  requestedAt: Date;
  employee: User;
};

type Vacation = {
  _id: string;
  employee: User;
  requestDate: Date;
  status: Status;
  message?: string;
  reason?: string;
};
