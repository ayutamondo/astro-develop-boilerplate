import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const name = formData.get('name')?.toString() ?? ''
  const email = formData.get('email')?.toString() ?? ''
  const message = formData.get('message')?.toString() ?? ''

  // サーバー側のバリデーション（任意）
  if (!name || !email.includes('@') || !message) {
    return new Response('バリデーションエラー', { status: 400 })
  }

  // 処理（メール送信など）
  console.log({ name, email, message })

  return new Response('送信完了しました。ありがとうございました！')
}
