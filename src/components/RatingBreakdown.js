"use client";

const STARS = [5, 4, 3, 2, 1];

export default function RatingBreakdown({
  rating,
  reviewCount,
  breakdown,
  selectedStar = null,
  onSelectStar,
}) {
  const maxCount = Math.max(...STARS.map((star) => breakdown[star] || 0), 1);

  return (
    <div className="rating-breakdown">
      <div className="rating-breakdown-summary">
        <p className="rating-breakdown-average">{rating > 0 ? rating.toFixed(1) : "-"}</p>
        <div>
          <StarDisplay rating={rating} />
          <p className="rating-breakdown-count">{reviewCount}件の口コミ</p>
        </div>
      </div>

      <div className="rating-breakdown-bars">
        {STARS.map((star) => {
          const count = breakdown[star] || 0;
          const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
          const isActive = selectedStar === star;
          const isDisabled = count === 0;

          return (
            <button
              key={star}
              type="button"
              className={`rating-breakdown-row ${isActive ? "active" : ""}`}
              onClick={() => {
                if (!onSelectStar || isDisabled) {
                  return;
                }

                onSelectStar(isActive ? null : star);
              }}
              disabled={!onSelectStar || isDisabled}
              aria-pressed={isActive}
            >
              <span className="rating-breakdown-label">{star}★</span>
              <span className="rating-breakdown-bar-track">
                <span
                  className="rating-breakdown-bar-fill"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </span>
              <span className="rating-breakdown-number">
                {count}人（{percent}%）
              </span>
            </button>
          );
        })}
      </div>

      {selectedStar && onSelectStar ? (
        <button type="button" className="rating-breakdown-clear" onClick={() => onSelectStar(null)}>
          すべての口コミを表示
        </button>
      ) : null}
    </div>
  );
}

function StarDisplay({ rating }) {
  if (rating <= 0) {
    return <span className="rating">未評価</span>;
  }

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="rating">
      {"★".repeat(fullStars)}
      {hasHalf ? "☆" : ""}
      {"☆".repeat(emptyStars)}
    </span>
  );
}
