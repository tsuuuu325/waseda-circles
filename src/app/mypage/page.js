import Link from "next/link";
import StarRating from "../../components/StarRating";
import { auth } from "../../auth";
import { getMyReviews } from "../../lib/db";

export default async function MyPage() {
  const session = await auth();
  const reviews = await getMyReviews(session.user.id);

  return (
    <main className="page">
      <header className="header">
        <h1>マイページ</h1>
        <p>{session.user.name}さんの口コミ一覧</p>
      </header>

      {reviews.length === 0 ? (
        <p className="empty-message">まだ口コミを投稿していません。</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-card">
              <Link href={`/circle/${review.circleId}`} className="review-circle-link">
                {review.circleName}
              </Link>
              <div className="review-meta">
                <StarRating rating={review.rating} />
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
