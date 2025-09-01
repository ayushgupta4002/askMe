"use server"

import { User } from "@prisma/client";
import prisma from "@/lib/prisma";


export async function createUser({name, email , image }: {name: string, email: string, image?: string } ) {
  // console.log("Creating user with name: ", name, " and email: ", email);
  // Create user
 const user= await prisma.user.create({
    data: {
      email : email,
      name : name,
    },
  })

  return user;
}

export async function getUserByUserId(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      conversations: true
    }
  });
}

export async function deleteUserbyId(id: number) {
  return await prisma.user.delete({
    where: {
      id: id
    },
  });
}





export async function updateUser(user : User){
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user
    
  });
}





