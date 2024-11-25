import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "karkisushanka719@gmail.com",   // Use the correct environment variable or email address
        pass: "oudlwxznrhsnvmif",   // Use the correct password or App password
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log('Error: ', error);
    } else {
        console.log('Server is ready to take our messages'  );
    }
});

// Function to send the verification email
export const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // Recipient address
        subject: 'Verify your email', // Subject line
        html: `
            <p>Hi,</p>
            <p>Thank you for registering. Please use the following verification code to verify your email:</p>
            <h2>${verificationToken}</h2>
            <p>This code will expire in 24 hours.</p>
        `, // HTML content
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Function to send a welcome email
export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to our service!',
        html: `
            <p>Hi ${name},</p>
            <p>Welcome to our service! We're glad to have you with us.</p>
            <p>If you have any questions, feel free to reach out.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
};

// Function to send the password reset email
export const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Function to send reset success email
export const sendResetSuccessEmail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Successful',
        html: `
            <p>Hi,</p>
            <p>Your password has been successfully reset. If you didn't make this change, please contact support immediately.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset success email sent to ${email}`);
    } catch (error) {
        console.error('Error sending reset success email:', error);
        throw new Error('Failed to send reset success email');
    }
};
