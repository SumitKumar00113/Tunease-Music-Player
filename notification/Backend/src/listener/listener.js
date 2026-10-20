const { subscribeToQueue } = require("../messageBroker/rabbit");
const sendEmail = require("../utils/email");
const cacheService = require("../redis/cache.service");
const client=require('../redis/client.redis');
const _config = require("../config/config");

const startListener = async () => {
    await subscribeToQueue("user_created", async (msg) => {
        try {
            const { id, email, mobileNo, fullName, role } = msg;

            // Check if welcome email has already been sent (deduplication check)
            const deduplicationKey = `notification:sent:user_created:${id || email}`;
            const alreadySent = await cacheService.get(deduplicationKey);
            if (alreadySent) {
                console.log(`[Notification-Redis] Duplicate user_created event for ${email}. Skipping email send.`);
                return;
            }

    const formattedName = typeof fullName === 'object' && fullName !== null
        ? `${fullName.firstName || ''} ${fullName.lastName || ''}`.trim()
        : (fullName || 'User');

    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Tunease</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

                <!-- Header -->
                <div style="
                    background-color: #111111;
                    padding: 30px;
                    text-align: center;
                ">
                    <h1 style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                    ">
                        🎵 Tunease
                    </h1>

                    <p style="
                        margin: 8px 0 0;
                        color: #aaaaaa;
                        font-size: 14px;
                    ">
                        Your music, your mood.
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 35px 30px;">

                    <h2 style="
                        margin-top: 0;
                        color: #222222;
                    ">
                        Welcome, ${formattedName}! 🎉
                    </h2>

                    <p style="
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Your Tunease account has been successfully created.
                        We're excited to have you with us.
                    </p>

                    <div style="
                        background-color: #f7f7f7;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 25px 0;
                    ">

                        <h3 style="
                            margin-top: 0;
                            color: #222222;
                        ">
                            Account Details
                        </h3>

                        <p style="color: #555555;">
                            <strong>Name:</strong> ${formattedName}
                        </p>

                        <p style="color: #555555;">
                            <strong>Email:</strong> ${email}
                        </p>

                        <p style="color: #555555;">
                            <strong>Mobile:</strong> ${mobileNo || 'N/A'}
                        </p>

                        <p style="color: #555555;">
                            <strong>Role:</strong> ${role}
                        </p>

                    </div>

                    <p style="
                        color: #555555;
                        font-size: 15px;
                        line-height: 1.6;
                    ">
                        Start exploring music, discover new tracks, 
                        and enjoy your personalized listening experience.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">

                        <a href="${_config.CLIENT_URL}"
                           style="
                            display: inline-block;
                            background-color: #111111;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 14px 28px;
                            border-radius: 6px;
                            font-weight: bold;
                        ">
                            Start Listening 🎧
                        </a>

                    </div>

                    <p style="
                        color: #888888;
                        font-size: 13px;
                        text-align: center;
                    ">
                        Thanks for joining Tunease.
                    </p>

                </div>

                <!-- Footer -->
                <div style="
                    background-color: #f7f7f7;
                    padding: 20px;
                    text-align: center;
                ">

                    <p style="
                        margin: 0;
                        color: #888888;
                        font-size: 12px;
                    ">
                        © ${new Date().getFullYear()} Tunease Music Player.
                        All rights reserved.
                    </p>

                </div>

            </div>

        </body>
        </html>
    `;
    console.log("📧 Sending email to:", email);
    await sendEmail(
        email,
        "Welcome to Tunease — Your Account Has Been Created 🎵",
        `Hi ${formattedName}, your Tunease account has been successfully created. Welcome to Tunease!`,
        template
    );

    // Cache sent state with 24 hours TTL (86400s) to prevent duplicate sends
    await cacheService.set(
        deduplicationKey,
        { sentAt: new Date().toISOString(), email },
        cacheService.EXPIRATION.EMAIL_DEDUPLICATION
    );
 } catch (error) {
    console.error("Error while sending welcome email:", error);
    throw error;
 }
});

await subscribeToQueue("verify_email",async(msg)=>{
    try{
        const {email,otp,user}=msg;
          if (!email || !otp) {
    throw new Error("Missing email or OTP");
  }
        const key=`otp:email:${user.id}`;
        const storedHash=await client.get(key);
        if (!storedHash) {
  return res.status(400).json({
    message: "OTP has expired or was not requested",
  });
}
const template=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Tunease</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    ">
      <div style="
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      ">

        <!-- Same header as registration email -->
        <div style="
          background-color: #111111;
          padding: 30px;
          text-align: center;
        ">
          <h1 style="margin:0;color:#ffffff;font-size:28px;">
            🎵 Tunease
          </h1>
          <p style="margin:8px 0 0;color:#aaaaaa;font-size:14px;">
            Your music, your mood.
          </p>
        </div>

        <!-- OTP content -->
        <div style="padding:35px 30px;">
          <h2 style="margin-top:0;color:#222222;">
            Verify Your Email 📩
          </h2>

          <p style="color:#555555;font-size:16px;line-height:1.6;">
            Hi ${user.fullName},
          </p>

          <p style="color:#555555;font-size:16px;line-height:1.6;">
            Please use the verification code below to verify
            your email address and continue with Tunease.
          </p>

          <div style="
            background-color:#f7f7f7;
            padding:25px 20px;
            border-radius:8px;
            margin:25px 0;
            text-align:center;
            border:1px solid #e5e5e5;
          ">
            <p style="
              margin:0 0 15px;
              color:#777777;
              font-size:12px;
              letter-spacing:2px;
            ">
              YOUR VERIFICATION CODE
            </p>

            <div style="
              color:#111111;
              font-size:36px;
              font-weight:bold;
              letter-spacing:8px;
            ">${otp}</div>

            <p style="
              margin:18px 0 0;
              color:#777777;
              font-size:13px;
            ">
              This code expires in 5 minutes.
            </p>
          </div>

          <p style="color:#555555;font-size:15px;line-height:1.6;">
            If you didn't request this code, you can safely
            ignore this email.
          </p>

          <p style="color:#888888;font-size:13px;line-height:1.6;">
            For your security, never share your verification
            code with anyone.
          </p>
        </div>

        <!-- Same footer as registration email -->
        <div style="
          background-color:#f7f7f7;
          padding:20px;
          text-align:center;
        ">
          <p style="margin:0;color:#888888;font-size:12px;">
            © ${new Date().getFullYear()} Tunease Music Player.
            All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

    await sendEmail(
    email,
    "Verify Your Email - Tunease",
    `Your verification code is ${otp}. It expires in 5 minutes.`,
    template
  );    
    }catch (error) {
    console.error("Error while sending welcome email:", error);
    throw error;
 }
})
}



module.exports=startListener;
