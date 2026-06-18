# ネット公開手順（Vercel + Turso + メール認証）

## 公開前チェックリスト

- [ ] 1メール1アカウント（メール認証）が動いている
- [ ] 1人1サークル1口コミが動いている
- [ ] プロジェクトは OneDrive 外（`C:\dev\waseda-circles` 推奨）で開発
- [ ] GitHub にコードを push 済み

---

## 1. Turso（本番データベース）

1. [https://turso.tech](https://turso.tech) でアカウント作成
2. データベースを1つ作成
3. **Database URL** と **Auth Token** を控える

---

## 2. Resend（確認メール送信）

1. [https://resend.com](https://resend.com) でアカウント作成
2. API Key を取得
3. 独自ドメインがあれば送信元メールを設定（なければ `onboarding@resend.dev` でテスト可能）

---

## 3. Vercel にデプロイ

1. [https://vercel.com](https://vercel.com) でアカウント作成
2. GitHub リポジトリを連携
3. 環境変数を設定：

| 名前 | 値 |
|------|-----|
| `DATABASE_URL` | Turso の libsql URL |
| `TURSO_AUTH_TOKEN` | Turso の Auth Token |
| `AUTH_SECRET` | ランダムな長い文字列（32文字以上） |
| `NEXT_PUBLIC_APP_URL` | 公開URL（例：`https://your-app.vercel.app`） |
| `RESEND_API_KEY` | Resend の API Key |
| `EMAIL_FROM` | 送信元（例：`noreply@your-domain.com`） |

4. Deploy

---

## 4. 本番DBの初期化

```powershell
$env:DATABASE_URL="（Tursoのlibsql URL）"
$env:TURSO_AUTH_TOKEN="（TursoのAuth Token）"
npm run db:setup:turso
```

※ Turso では `npx prisma migrate deploy` が使えないことがあるため、上のコマンド1つでテーブル作成＋初期データ投入を行います。

---

## 5. ローカル開発

```powershell
cd C:\dev\waseda-circles
$env:NODE_OPTIONS="--use-system-ca"
npm run dev:clean
```

メール送信設定がない場合、登録後の画面に **開発用の認証リンク** が表示されます。

---

## 6. 不正登録の防止（実装済み）

| ルール | 内容 |
|--------|------|
| 1メール1アカウント | 同じメールで再登録不可 |
| メール認証必須 | リンクを開くまでログイン不可 |
| 1人1口コミ | 同じサークルに2件投稿不可 |

---

## 7. マイグレーション（ローカル）

メール認証を追加したあと：

```powershell
$env:NODE_OPTIONS="--use-system-ca"
npx prisma migrate dev --name email_verification
npm run dev:clean
```

既存のアカウントは自動的に「認証済み」になります。
