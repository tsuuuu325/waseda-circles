"use client";

import { useMemo, useState } from "react";
import { filterReviewsByStar } from "../lib/ratings";
import RatingBreakdown from "./RatingBreakdown";
import StarRating from "./StarRating";

export default function ReviewList({ reviews, rating, reviewCount, breakdown }) {
  const [selectedStar, setSelectedStar] = useState(null);

  const filteredReviews = useMemo(
    () => filterReviewsByStar(reviews, selectedStar),
    [reviews, selectedStar]
  );

  return (
    <section>
      <h2 className="section-title">口コミ</h2>

      <RatingBreakdown
        rating={rating}
        reviewCount={reviewCount}
        breakdown={breakdown}
        selectedStar={selectedStar}
        onSelectStar={setSelectedStar}
      />

      <p className="result-count">
        {selectedStar
          ? `★${selectedStar}の口コミ ${filteredReviews.length}件`
          : `口コミ一覧 ${filteredReviews.length}件`}
      </p>

      {filteredReviews.length === 0 ? (
        <p className="empty-message">
          {selectedStar ? `★${selectedStar}の口コミはまだありません。` : "まだ口コミがありません。"}
        </p>
      ) : (
        <ul className="review-list">
          {filteredReviews.map((review) => (
            <li key={review.id} className="review-card">
              <div className="review-meta">
                <StarRating rating={review.rating} />
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-author">{review.authorName}</p>
              <p className="review-text">{review.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
