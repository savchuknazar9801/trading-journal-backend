import { auth } from "../configs/firebase.js";
import { NextFunction, Request, Response } from "express";
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import * as dotenv from 'dotenv';

// Configuring dotenv to allow env variable access 
dotenv.config();

// Set API Key from environment variables 
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    throw new Error('SendGrid API key cannot be found');
}

// Send Message 
export const sendEmail = async (message: MailDataRequired) => {
    await sgMail.send(message);
}


/**
 * ======================================================================
 * ========================== EMAIL SENDS HERE ==========================
 * ======================================================================
 */
export const sendVerificationEmail = async (req: Request, next: NextFunction) => {
    try {
        const { email, name } = req.body;
        const firstName = name.split(' ')[0];

        // Generate verification link for user
        const emailVerificationUrl = await auth.generateEmailVerificationLink(email, {
            url: `https://api.trackedge.io/users/verified/${firstName}/${email}`
        });
        
        // Generate the MailDataRequired to send email 
        const message: MailDataRequired = {
            to: email,
            from: {
                email: 'verify@trackedge.io',
                name: 'The TrackEdge Team'
            },
            templateId: 'd-3d8ad90dbb9e4fecab4596088f415739',
            dynamicTemplateData: {
                firstName: firstName,
                confirmationUrl: emailVerificationUrl, 
                privacyUrl: `${process.env.APP_URL}/privacy`,
                termsUrl: `${process.env.APP_URL}/terms`
            }
        };

        // Send the email
        await sendEmail(message);
    } catch (error) {
        // Throw the error (asyncHandler will catch and process)
        throw error;
    }
}

export const sendWelcomeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, email } = req.params;
    
    try {
        // Generate the MailDataRequired to send email 
        const message: MailDataRequired = {
            to: email, 
            from: {
                email: 'welcome@trackedge.io',
                name: 'The TrackEdge Team'
            },
            templateId: 'd-d2dad786deb047e7a0c7015e2c8d63f5',
            dynamicTemplateData: {
                firstName: firstName,
                privacyUrl: `${process.env.APP_URL}/privacy`,
                termsUrl: `${process.env.APP_URL}/terms`
            }
        }

        // Send the email 
        await sendEmail(message);
    } catch (error) {
        // Throw the error (asyncHandler will catch and process)
        throw error;
    }
}