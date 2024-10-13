import { postsApi } from "@/db/post";
import { PostAction, postActionSchema } from "@/lib/schemas";
import { Post } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const incFieldsSchema: Record<PostAction, keyof Omit<Post, "id">> = {
  [PostAction.READ]: "reads",
  [PostAction.LIKE]: "likes",
  [PostAction.VIEW]: "views",
};

export const dynamic = "force-dynamic"; // defaults to auto
export async function PATCH(request: Request) {
  try {
    const body = await postActionSchema.safeParseAsync(await request.json());
    if (!body.success)
      return new Response(JSON.stringify(body.error.issues), { status: 400 });
    const post = await postsApi
      .updatePost({
        [incFieldsSchema[body.data.action]]: 1,
      })
      .catch((err) => {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          return postsApi.createPost({
            id: body.data.postId,
            [incFieldsSchema[body.data.action]]: 1,
          });
        }

        console.log(err);
      });
    return new Response(JSON.stringify({ post }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}
