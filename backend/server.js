const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Fix: Add a route to avoid "Cannot GET /" error
app.get("/", (req, res) => {
    res.send("📡 Email Notification Server is Running!");
});

// 🚀 Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "beprivate007@gmail.com", // ⬅️ Replace with your Gmail
        pass: "nace cktv nmao jjnb"     // ⬅️ Use an App Password (Not your Gmail password)
    }
});

// 📩 API Endpoint to Send Email Alerts
app.post("/send-alert", async (req, res) => {
    const { productId, location, reporter } = req.body;

    if (!productId || !location || !reporter) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`🚨 Fake Product Alert! Product ID: ${productId}, Location: ${location}`);

    // 📧 Email Content
    const mailOptions = {
        from: "beprivate007@gmail.com",
        to: "245121737172@mvsrec.edu.in",  // ⬅️ Replace with Manufacturer's Email
        subject: "🚨 Fake Product Alert",
        text: `A fake product has been reported!\n\nProduct ID: ${productId}\nLocation: ${location}\nReported by: ${reporter}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully.");
        res.json({ message: "Email alert sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

// ✅ Fix: Start Server
app.listen(PORT, () => {
    console.log(`📡 Email Notification Server running on http://localhost:${PORT}`);
});