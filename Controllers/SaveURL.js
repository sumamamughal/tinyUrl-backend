import URL from "../Models/url.js";

export const SaveURL = async (req, res) => {
  try {
    const { longUrl, alias } = req.body;

    if (!longUrl) {
      return res.status(400).json({ message: "Long URL is required" });
    }

    // Use alias or random short ID
    const shortId = alias || Math.random().toString(36).substring(2, 8);

    // Check if alias already exists
    const existing = await URL.findOne({ shortId });
    if (existing) {
      return res.status(400).json({ message: "Alias already in use" });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/${shortId}`;
    
    const newUrl = new URL({ 
      longUrl, 
      shortId,
      metadata: {
        alias: alias || null
      }
    });
    await newUrl.save();

    res.json({ shortUrl, shortId });
  } catch (error) {
    console.error("Error saving URL:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
