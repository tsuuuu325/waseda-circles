"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StarRating from "./StarRating";

const CATEGORIES = [
  { value: "all", label: "すべて" },
  { value: "体育系", label: "体育系" },
  { value: "文化系", label: "文化系" },
  { value: "その他", label: "その他" },
];

export default function CircleList({ circles }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredCircles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return circles.filter((circle) => {
      const matchesCategory = category === "all" || circle.category === category;
      const matchesSearch =
        query === "" ||
        circle.name.toLowerCase().includes(query) ||
        circle.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [circles, search, category]);

  return (
    <>
      <div className="search-section">
        <label className="search-label" htmlFor="search">
          サークルを検索
        </label>
        <input
          id="search"
          type="search"
          className="search-input"
          placeholder="例：ラグビー、音楽、テニス"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`category-tab ${category === item.value ? "active" : ""}`}
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="result-count">{filteredCircles.length}件のサークル</p>

      {filteredCircles.length === 0 ? (
        <p className="empty-message">条件に合うサークルが見つかりませんでした。</p>
      ) : (
        <ul className="circle-list">
          {filteredCircles.map((circle) => (
            <li key={circle.id}>
              <Link href={`/circle/${circle.id}`} className="circle-card">
                <span className="category">{circle.category}</span>
                <h2>{circle.name}</h2>
                <p className="description">{circle.description}</p>
                <div>
                  <StarRating rating={circle.rating} />
                  <span className="review-count">（{circle.reviewCount}件の口コミ）</span>
                </div>
                <span className="card-hint">タップして口コミを見る →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
