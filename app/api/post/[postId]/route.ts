import { postsApi } from "@/db/post";
import { postQuerySchema } from "@/lib/schemas";
import { Post } from "@prisma/client";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const paramsParsed = await postQuerySchema.safeParseAsync(params);

    if (!paramsParsed.success)
      return new Response(JSON.stringify(paramsParsed.error.issues), {
        status: 400,
      });

    const { postId } = paramsParsed.data;

    const post =
      (await postsApi.getPost(postId)) ??
      ({
        id: postId,
        reads: 0,
        views: 1,
        likes: 0,
      } satisfies Post);
    return new Response(JSON.stringify({ post }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }));
  }
}
