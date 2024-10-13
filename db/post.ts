import { Post, Prisma } from "@prisma/client";
import { db } from ".";

const createPost = async (post: Prisma.PostCreateInput) => {
  return (
    await db.query(
      `INSERT INTO posts (${Object.keys(post)
        .map((key) => `'${key}'`)
        .join(", ")}) VALUES (${Object.values(post).map(
        (value, index) => `$${index}`
      )}) RETURNING *`,
      Object.values(post)
    )
  ).rows as Post[];
};

const getPost = async (postId: string) => {
  return (await db.query(`SELECT * FROM posts WHERE id = $1`, [postId]))
    .rows[0] as Post;
};

const updatePost = async (post: Prisma.PostUpdateInput) => {
  return await db.query(
    `UPDATE posts SET ${Object.keys(post)
      .map((key) => `${key} = $${Object.values(post).indexOf(key) + 1}`)
      .join(", ")} WHERE id = $${Object.values(post).length + 1}`,
    Object.values(post)
  );
};

const getAllPosts = async () => {
  return (await db.query(`SELECT * FROM posts`)).rows as Post[];
};

export const postsApi = {
  createPost,
  getPost,
  updatePost,
  getAllPosts,
} as const;
