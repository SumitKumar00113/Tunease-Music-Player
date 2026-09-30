const {subscribeToQueue}=require("../messageBroker/rabbit");
const sendEmail=require("../utils/email");



const startListener=async()=>{
await subscribeToQueue("user_created", async (msg) => {
 try{
       const { email, mobileNo, fullName, role } = msg;

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
                        Welcome, ${fullName}! 🎉
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
                            <strong>Name:</strong> ${fullName}
                        </p>

                        <p style="color: #555555;">
                            <strong>Email:</strong> ${email}
                        </p>

                        <p style="color: #555555;">
                            <strong>Mobile:</strong> ${mobileNo}
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

                        <a href="http://localhost:5173"
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
   await sendEmail(
    email,
    "Welcome to Tunease — Your Account Has Been Created 🎵",
    `Hi ${fullName}, your Tunease account has been successfully created. Welcome to Tunease!`,
    template
);
 }catch (error) {
            console.error("Error while sending welcome email:", error);
        }
});
}


module.exports=startListener;