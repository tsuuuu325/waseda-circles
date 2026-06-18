import Link from "next/link";
import { auth } from "../auth";
import { logoutAction } from "../app/actions";
import { SITE_NAME } from "../lib/site";

export default async function Header() {
  const session = await auth();

  return (
    <nav className="site-header">
      <Link href="/" className="site-logo">
        {SITE_NAME}
      </Link>
      <div className="site-nav">
        {session?.user ? (
          <>
            <span className="user-name">{session.user.name}さん</span>
            <Link href="/mypage" className="nav-link">
              マイページ
            </Link>
            <Link href="/circles/new" className="nav-link">
              サークル追加
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="nav-button">
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">
              ログイン
            </Link>
            <Link href="/register" className="nav-button-link">
              新規登録
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
