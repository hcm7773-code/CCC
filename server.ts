import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Food Recommendation & Customization Assistant
  app.post('/api/ai-recommend', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY 未設定，無法使用 AI 點餐建議功能。',
        });
      }

      const { userPreference, budget, peopleCount, menuItems } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
你是一位專業且風趣的餐廳點餐大師「阿達師」。
請根據顧客的要求以及我們的菜單列表，為顧客推薦最合適的餐點組合。

顧客要求:
- 偏好/需求: ${userPreference || '無特別指定，請推薦招牌組合'}
- 預算上限: ${budget ? `${budget} 元` : '不限'}
- 用餐人數: ${peopleCount || 1} 人

我們的菜單列表:
${JSON.stringify(menuItems, null, 2)}

請以繁體中文回答，格式包含：
1. 【點餐大師推薦組合】：列出推薦的菜單項目名稱、數量與預估總金額。
2. 【推薦理由】：說明為什麼這個組合適合顧客（考慮口味搭配、熱量平衡或飽足感）。
3. 【貼心客製建議】：針對選擇的餐點提供辣度、甜度冰量或加價購的貼心提示。

請保持態度親切、幽默專業，並確保推薦的品項完全存在於提供的菜單列表中。
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        recommendation: response.text || '無法生成建議，請稍後再試。',
      });
    } catch (error: any) {
      console.error('AI Recommendation Error:', error);
      res.status(500).json({ error: error?.message || 'AI 點餐建議服務暫時無法使用' });
    }
  });

  // Vite middleware for dev or static files for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
