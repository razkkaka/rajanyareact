import express from 'express'

const router = express.Router()

router.post('/recommendation', async (req, res) => {
  const { mood, preference, budget } = req.body
  const apiKey = process.env.GROQ_API_KEY

  const fallback = [
    'Rekomendasi: Iced Palm Sugar Latte untuk suasana cozy dan manis.',
    'Coba Cold Brew jika Anda ingin kopi yang fresh dan smooth.',
    'Pilih Matcha Latte untuk mood yang creamy dan menyegarkan.',
  ]

  if (!apiKey) {
    return res.json({ recommendation: fallback[0] })
  }

  const prompt = `Anda adalah asisten AI Backseat Barista. Berikan rekomendasi 1-2 minuman dari menu baru. Mood: ${mood || 'general'}, preferensi: ${preference || 'kopi'}, budget: ${budget || 'sesukanya'}. Berikan jawaban singkat dalam Bahasa Indonesia.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful coffee shop assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || fallback[0]
    res.json({ recommendation: text.trim() })
  } catch (error) {
    console.error(error)
    res.json({ recommendation: fallback[0] })
  }
})

export default router
