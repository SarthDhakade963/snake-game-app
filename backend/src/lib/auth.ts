import prisma from "../prisma";

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return user;
  } catch (error) {
    console.error("Server Error while creating user", error);
    throw error;
  }
};

// find unique username
export const usernameExists = async (username: string) => {
  try {
    const userName = await prisma.user.findUnique({
      where: { username },
    });

    return userName;
  } catch (error) {
    console.error("Server error while finding username exists", error);
    throw error;
  }
};

export const userEmailExists = async (email: string) => {
  try {
    const userEmail = await prisma.user.findUnique({
      where: { email },
    });

    return userEmail;
  } catch (error) {
    console.error("Server error while finding user email exists", error);
    throw error;
  }
};

export const findUniqueUserId = async (id: string) => {
  try {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, username: true },
    });
  } catch (error) {
    console.error("Server while fetching unique user", error);
    throw error;
  }
};

export const getUserName = async (id: string) => {
  try {
    const res = await prisma.user.findUnique({
      where: { id },
      select: { username: true },
    });

    return res?.username || null;
  } catch (error) {
    console.error("Server Error fetching username", error);
    return null;
  }
};
