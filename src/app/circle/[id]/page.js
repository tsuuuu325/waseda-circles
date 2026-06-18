import Link from "next/link";
import CircleEditForm from "../../../components/CircleEditForm";
import ReviewForm from "../../../components/ReviewForm";
import ReviewList from "../../../components/ReviewList";
import StarRating from "../../../components/StarRating";
import { auth } from "../../../auth";
import { getCircleById } from "../../../lib/db";

export default async function CircleDetailPage({ params }) {
  const { id } = await params;
  const circleId = Number(id);
  const [circle, session] = await Promise.all([getCircleById(circleId), auth()]);

  if (!circle) {
    return (
      <main className="page">
        <p>サークルが見つかりませんでした。</p>
        <Link href="/" className="back-link">
          ← 一覧に戻る
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link href="/" className="back-link">
        ← 一覧に戻る
      </Link>

      <header className="header detail-header">
        <span className="category">{circle.category}</span>
        <h1>{circle.name}</h1>
        <p className="description">{circle.description}</p>
        <StarRating rating={circle.rating} />
      </header>

      <CircleEditForm
        circleId={circleId}
        category={circle.category}
        description={circle.description}
        isLoggedIn={!!session?.user}
      />

      <ReviewForm
        circleId={circleId}
        isLoggedIn={!!session?.user}
        hasAlreadyReviewed={
          session?.user?.id
            ? circle.reviews.some((review) => review.userId === session.user.id)
            : false
        }
      />

      <ReviewList
        reviews={circle.reviews}
        rating={circle.rating}
        reviewCount={circle.reviewCount}
        breakdown={circle.ratingBreakdown}
      />
    </main>
  );
}
