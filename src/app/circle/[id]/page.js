import Link from "next/link";
import ReviewForm from "../../../components/ReviewForm";
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

      <ReviewForm
        circleId={circleId}
        isLoggedIn={!!session?.user}
        hasAlreadyReviewed={
          session?.user?.id
            ? circle.reviews.some((review) => review.userId === session.user.id)
            : false
        }
      />

      <section>
        <h2 className="section-title">口コミ一覧（{circle.reviews.length}件）</h2>
        {circle.reviews.length === 0 ? (
          <p className="empty-message">まだ口コミがありません。</p>
        ) : (
          <ul className="review-list">
            {circle.reviews.map((review) => (
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
    </main>
  );
}
