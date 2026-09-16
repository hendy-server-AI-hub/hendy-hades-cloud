// routes/bots.ts
import { Hono } from "hono";

const botRouter = new Hono();

// API: Nhận dữ liệu hàng loạt và lọc ra các Bot đang lỗi
botRouter.post("/analyze-status", async (c) => {
  try {
    // Lấy dữ liệu JSON từ body của request
    const body = await c.req.json();
    const { bots, systemLoad } = body;

    if (!bots || !Array.isArray(bots)) {
      return c.json({ error: "Payload không hợp lệ. Cần mảng 'bots'." }, 400);
    }

    // --- LOGIC PHỨC TẠP BẮT ĐẦU Ở ĐÂY ---
    // Ví dụ: Lọc các bot offline và tính toán thời gian downtime trung bình
    const offlineBots = bots.filter(b => b.status === 'OFFLINE' || b.status === 'ERROR');
    
    // Giả lập một tiến trình xử lý nặng (mapping, reduce...)
    const analytics = offlineBots.map(bot => ({
      botId: bot.id,
      criticalLevel: bot.downtime > 3600 ? 'HIGH' : 'LOW',
      recommendedAction: "RESTART_REQUIRED"
    }));

    // --- TRẢ VỀ KẾT QUẢ ---
    return c.json({
      success: true,
      totalAnalyzed: bots.length,
      issuesFound: offlineBots.length,
      analytics: analytics,
      advice: systemLoad > 80 ? "Cảnh báo: Server đang quá tải!" : "Hệ thống ổn định."
    });

  } catch (error) {
    console.error("Lỗi xử lý API /analyze-status:", error);
    return c.json({ error: "Lỗi máy chủ nội bộ" }, 500);
  }
});

export default botRouter;
