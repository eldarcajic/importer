import { Board, User } from "@/types/entity-types";

export const getBoards = async () => {
  const response = await fetch("http://localhost:5000/boards");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const boards: Board[] = await response.json();

  return boards;
};

export const getUsers = async () => {
  const response = await fetch("http://localhost:5000/users");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const users: User[] = await response.json();

  return users;
};

export const validateData = async (jsonData: any) => {
  const response = await fetch("http://localhost:5000/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tables: jsonData }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
