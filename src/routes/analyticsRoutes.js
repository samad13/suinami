import express from "express";
import Analytics from "../models/Analytics.js";

const router = express.Router();


router.get("/stats", async (req, res) => {
  try {
    
    const mostRequestedProject = await Analytics.aggregate([
      { $group: { _id: "$name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const mostUsedTwitterHandle = await Analytics.aggregate([
      { $group: { _id: "$twitterHandle", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    
    const tweetTypeStats = await Analytics.aggregate([
      { $group: { _id: "$tweetType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

   
    const usageByLocation = await Analytics.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    
    const usageHistory = await Analytics.find().sort({ createdAt: -1 });

    
    const latestRequests = await Analytics.find().sort({ createdAt: -1 }).limit(50);

  
    const mostActiveIPs = await Analytics.aggregate([
      { $group: { _id: "$ip", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    
    const userAgentStats = await Analytics.aggregate([
      { $group: { _id: "$userAgent", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalRequests = await Analytics.countDocuments();

    res.json({
      success: true,
      totals: {
        totalRequests
      },
      projects: mostRequestedProject,
      twitterHandles: mostUsedTwitterHandle,
      tweetTypes: tweetTypeStats,
      locations: usageByLocation,
      history: usageHistory,
      latestRequests,
      ipStats: mostActiveIPs,
      userAgents: userAgentStats
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch analytics" });
  }
});

export default router;
