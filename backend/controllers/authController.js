import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/usersModel.js";
import transporter from "../config/nodeMailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE
} from "../config/emailTemplates.js";

//register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.json({ success: false, message: "user already Exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //Sending a mail to user

    // transporter.verify(function (error, success) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("SMTP server is ready");
    //   }
    // });

    try {
      const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "🎉 Welcome to MedMatrix",
        text: `Your account has been created with email id : ${email}`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          text-align: center;
          padding: 30px;
        }
        .content {
          padding: 40px 30px;
          color: #333;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #4f46e5;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f9fafb;
          color: #666;
          font-size: 14px;
        }
        .email {
          color: #4f46e5;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="header">

          <p>Your journey starts here.</p>
        </div>

        <div class="content">
          <h2>Hello there 👋</h2>

          <p>
            Thank you for joining <strong>MEDMATRIX</strong>.
            We're excited to have you as part of our community.
          </p>

          <p>
            Your account has been successfully created with:
          </p>

          <p class="email">${email}</p>

          <p>
            You can now access all features and start exploring the platform.
          </p>

          <center>
            <a href="http://localhost:5173" class="button">
              Get Started 🚀
            </a>
          </center>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} GREATSTACK. All rights reserved.</p>
          <p>If you did not create this account, please ignore this email.</p>
        </div>

      </div>
    </body>
    </html>
    `,
      });
    } catch (err) {
      console.error("Error while sending mail:", err);
    }

    res.json({ success: true, message: "Email Sent" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//login

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    res.json({ success: false, message: "email and password are required!" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send verification Otp

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      res.json({ success: false, message: "user is already Verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Verification OTP",
        html : EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp),
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: "Verificaiton OTP sent on Email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//verify the otp

export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "OTP is required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP is Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: "user is authenticated" });
  } catch (error) {
    res.json({ success: false, message: err.message });
  }
};

export const sendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Verification OTP",
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp),
    });

    return res.json({
      success: true,
      message: "Reset password OTP sent on Email"
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export const verifyResetPassword = async (req, res) => {
  
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP and New Password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
