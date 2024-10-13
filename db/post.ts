import { Post, Prisma } from "@prisma/client";
import { db } from ".";

const createPost = async (post: Prisma.PostCreateInput) => {
  return (
    await db.query(
      `INSERT INTO posts (${Object.keys(post).join(
        ", "
      )}) VALUES (${Object.values(post).map(
        (value, index) => `$${index + 1}`
      )}) RETURNING *`,
      Object.values(post)
    )
  ).rows as Post[];
};

const getPost = async (postId: string) => {
  return (await db.query(`SELECT * FROM posts WHERE id = $1`, [postId]))
    .rows[0] as Post;
};

const updatePost = async (post: Prisma.PostUpdateInput, postId: string) => {
  return (
    await db.query(
      `UPDATE posts SET ${Object.keys(post)
        .map((key, ix) => `${key} = $${ix + 1}`)
        .join(", ")} WHERE id = $${Object.values(post).length + 1}
      RETURNING *`,
      [...Object.values(post), postId]
    )
  ).rows[0];
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
