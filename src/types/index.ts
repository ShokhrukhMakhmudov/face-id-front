export type Section = {
  name: string;
  _id: string;
};

export type User = {
  _id: string;
  name: string;
  lastname: string;
  sectionId: string;
  photo: string;
};

export type Visit = {
  _id: string;
  userName: string;
  sectionName: string;
  timestamp: string;
  userPhoto: string;
  visitPhoto: string;
  status: string;
};
