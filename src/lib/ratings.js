export function getRatingBreakdown(reviews) {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  for (const review of reviews) {
    if (breakdown[review.rating] !== undefined) {
      breakdown[review.rating] += 1;
    }
  }

  return breakdown;
}

export function getAverageRating(reviews) {
  if (reviews.length === 0) {
    return 0;
  }

  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export function matchesStarFilter(rating, reviewCount, starFilter) {
  if (starFilter === "all") {
    return true;
  }

  if (starFilter === "none") {
    return reviewCount === 0;
  }

  const star = Number(starFilter);

  if (!star || reviewCount === 0) {
    return false;
  }

  return Math.round(rating) === star;
}

export function filterReviewsByStar(reviews, starFilter) {
  if (starFilter === "all" || starFilter === null) {
    return reviews;
  }

  return reviews.filter((review) => review.rating === starFilter);
}
