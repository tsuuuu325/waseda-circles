export default function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className="rating">
      {"★".repeat(fullStars)}
      {hasHalf ? "☆" : ""}
      {"☆".repeat(emptyStars)}
      {" "}
      {rating > 0 ? rating.toFixed(1) : "未評価"}
    </span>
  );
}
