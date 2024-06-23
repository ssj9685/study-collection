"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, MouseEvent } from "react";

interface ArticleInfo {
  articleno: number;
  userid: string;
  subject: string;
  content: string;
}

export default function Home() {
  const baseUrl =
    "http://ec2-54-180-235-213.ap-northeast-2.compute.amazonaws.com:4000";

  const { data, refetch } = useQuery({
    queryKey: ["article"],
    queryFn: async () => {
      const res = await fetch(baseUrl);
      return res.json() as Promise<ArticleInfo[]>;
    },
  });

  const { mutate: addArticle } = useMutation({
    mutationFn: async (params: ArticleInfo) => {
      return await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(params),
      });
    },
    onSettled() {
      refetch();
    },
  });

  const { mutate: updateArticle } = useMutation({
    mutationFn: async (params: ArticleInfo) => {
      return await fetch(`${baseUrl}/${params.articleno}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(params),
      });
    },
    onSettled() {
      refetch();
    },
  });

  const { mutate: deleteArticle } = useMutation({
    mutationFn: async (params: { articleno: number }) => {
      return await fetch(`${baseUrl}/${params.articleno}`, {
        method: "DELETE",
      });
    },
    onSettled() {
      refetch();
    },
  });

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as ArticleInfo;

    const { userid, subject } = data;

    if (!userid) {
      alert("아이디를 입력하세요.");
    }

    if (!subject) {
      alert("제목을 입력하세요.");
    }

    addArticle(data);
  };

  const handleOnUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as ArticleInfo;

    updateArticle(data);
  };

  const handleOnDelete = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Partial<ArticleInfo>;
    const { articleno } = data;

    if (articleno) {
      deleteArticle({ articleno });
    }
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input name="userid" />
        <input name="subject" />
        <input name="content" />
        <button>추가</button>
      </form>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <span>article</span>
        <span>userid</span>
        <span>subject</span>
        <span>content</span>
        <span></span>
      </div>
      {data?.map((d) => {
        const { articleno, userid, subject, content } = d;

        return (
          <form
            onSubmit={(e) => e.preventDefault()}
            key={articleno}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
            }}
          >
            <input name="articleno" defaultValue={articleno} readOnly />
            <input name="userid" defaultValue={userid} />
            <input name="subject" defaultValue={subject} />
            <input name="content" defaultValue={content} />
            <span style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleOnUpdate}>수정</button>
              <button onClick={handleOnDelete}>삭제</button>
            </span>
          </form>
        );
      })}
    </div>
  );
}
