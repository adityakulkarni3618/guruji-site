"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`).then((r) => r.json()).then(setPost);
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Edit Article</h1>
      {post ? <BlogForm initial={post} postId={id} /> : <p className="text-cream-dim">Loading…</p>}
    </div>
  );
}
