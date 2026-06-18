import { prisma } from "./prisma";

import { getAverageRating, getRatingBreakdown } from "./ratings";

function withStats(circle) {
  const reviewCount = circle.reviews.length;
  const rating = getAverageRating(circle.reviews);
  const ratingBreakdown = getRatingBreakdown(circle.reviews);

  return {
    id: circle.id,
    name: circle.name,
    category: circle.category,
    description: circle.description,
    rating,
    reviewCount,
    ratingBreakdown,
  };
}

function formatReview(review) {
  return {
    id: review.id,
    rating: review.rating,
    text: review.text,
    date: review.createdAt.toISOString().slice(0, 10),
    authorName: review.user?.name || "匿名",
    circleName: review.circle?.name || "",
    circleId: review.circleId,
  };
}

export async function getAllCircles() {
  const circles = await prisma.circle.findMany({
    include: { reviews: true },
    orderBy: { id: "asc" },
  });

  return circles.map(withStats);
}

export async function getCircleById(id) {
  const circle = await prisma.circle.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });

  if (!circle) {
    return null;
  }

  return {
    ...withStats(circle),
    reviews: circle.reviews.map((review) => ({
      ...formatReview(review),
      userId: review.userId,
    })),
  };
}

export async function getMyReviews(userId) {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { circle: true },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map(formatReview);
}
