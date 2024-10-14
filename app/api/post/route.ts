import { postsApi } from "@/db/post";
import { PostAction, postActionSchema } from "@/lib/schemas";
import { Post } from "@prisma/client";

const incFieldsSchema: Record<PostAction, keyof Omit<Post, "id">> = {
  [PostAction.READ]: "reads",
  [PostAction.LIKE]: "likes",
  [PostAction.VIEW]: "views",
};

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  try {
    const body = await postActionSchema.safeParseAsync(await request.json());
    if (!body.success)
      return new Response(JSON.stringify(body.error.issues), { status: 400 });

    const { postId, action } = body.data;

    const dbPost = await postsApi.getPost(postId);

    if (!dbPost) {
      const post = await postsApi.createPost({
        id: postId,
        views: 1,
        [incFieldsSchema[action]]: 1,
      });

      return new Response(JSON.stringify({ post }));
    }

    const post = await postsApi.incrementPostField(
      postId,
      incFieldsSchema[action]
    );

    return new Response(JSON.stringify({ post }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}
