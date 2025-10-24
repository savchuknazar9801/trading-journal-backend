import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle validation errors from express-validator
    if (err.validationErrors) {
        res.status(err.statusCode || 400 ).json({
            success: false, 
            message: 'Validation failed',
            errors: err.validationErrors
        });

        return;
    }

    // Handle Firebase Authentication errors 
    if (err.code && err.code.startsWith('auth/')) {
        const firebaseError = handleFirebaseAuthError(err);
        res.status(firebaseError.statusCode).json({
            success: false, 
            message: firebaseError.message,
            errorCode: err.code
        });

        return;
    }
    
    // Handle Firebase Firestore errors 
    if (err.code && err.code.startsWith('firestore/')) {
        const firestoreError = handleFirestoreError(err);
        res.status(firestoreError.statusCode).json({
            success: false, 
            message: firestoreError.message,
            errorCode: err.code
        });

        return;
    }

    // Handle SendGrid errors 
    if (err.response && err.response.body && err.response.body.errors) {
        const sendGridError = handleSendGridError(err);
        res.status(sendGridError.statusCode).json({
            success: false, 
            message: sendGridError.message,
            errorCode: sendGridError.errorCode
        });

        return;
    }

    // Set default status code if not provided (SERVER_ERROR)
    const statusCode = err.statusCode || 500; 

    // Create a simple error response object
    const errorResponse = {
        success: false, 
        message: err.message || 'Something went wrong',
        // Only include stack trace in development environment 
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Log error for server-side debugging 
    console.error(`[${new Date().toISOString()}] Error:`, err);

    // Send error response to client 
    res.status(statusCode).json(errorResponse);
}

// Firebase Auth error handler helper
function handleFirebaseAuthError(err: any) {
    let statusCode = 401; // Default for auth errors
    let message = 'Authentication failed';
    
    // Map Firebase Auth error codes to appropriate HTTP status codes and messages
    switch (err.code) {
        // User management errors
        case 'auth/email-already-exists':
            statusCode = 409; // Conflict
            message = 'User with this email already exists';
            break;
        case 'auth/invalid-email':
            statusCode = 400; // Bad Request
            message = 'Invalid email format';
            break;
        case 'auth/user-not-found':
            statusCode = 404; // Not Found
            message = 'User not found';
            break;
        
        // Token errors
        case 'auth/id-token-expired':
        case 'auth/session-cookie-expired':
            statusCode = 401; // Unauthorized
            message = 'Your session has expired. Please sign in again';
            break;
        case 'auth/invalid-id-token':
        case 'auth/invalid-session-cookie':
            statusCode = 401; // Unauthorized
            message = 'Invalid authentication token';
            break;
        
        // Permission errors
        case 'auth/insufficient-permission':
            statusCode = 403; // Forbidden
            message = 'You do not have permission to perform this action';
            break;
        
        // Request errors
        case 'auth/argument-error':
        case 'auth/invalid-password':
        case 'auth/phone-number-already-exists':
        case 'auth/invalid-phone-number':
            statusCode = 400; // Bad Request
            message = 'Invalid request data';
            break;
            
        // Service errors
        case 'auth/internal-error':
        case 'auth/project-not-found':
            statusCode = 500; // Internal Server Error
            message = 'Authentication service error';
            break;
    }
    
    return { statusCode, message };
}

// Firebase Firestore error handler helper
function handleFirestoreError(err: any) {
    let statusCode = 500; // Default for database errors
    let message = 'Database operation failed';
    
    // Map Firestore error codes to appropriate HTTP status codes and messages
    switch (err.code) {
        // Not found errors
        case 'firestore/not-found':
            statusCode = 404; // Not Found
            message = 'Requested document does not exist';
            break;
        
        // Permission errors
        case 'firestore/permission-denied':
            statusCode = 403; // Forbidden
            message = 'You do not have permission to access this data';
            break;
        
        // Invalid argument errors
        case 'firestore/invalid-argument':
            statusCode = 400; // Bad Request
            message = 'Invalid request data';
            break;
        
        // Already exists errors
        case 'firestore/already-exists':
            statusCode = 409; // Conflict
            message = 'Document already exists';
            break;
        
        // Resource exhausted
        case 'firestore/resource-exhausted':
            statusCode = 429; // Too Many Requests
            message = 'Database quota exceeded or rate-limited';
            break;
        
        // Other errors
        case 'firestore/failed-precondition':
            statusCode = 400; // Bad Request
            message = 'Operation failed due to current database state';
            break;
        case 'firestore/aborted':
            statusCode = 409; // Conflict
            message = 'Operation aborted due to concurrent modification';
            break;
        case 'firestore/unavailable':
            statusCode = 503; // Service Unavailable
            message = 'Database service temporarily unavailable';
            break;
    }
    
    return { statusCode, message };
}

function handleSendGridError(err: any) {
    let statusCode = 500; // Default for email service errors
    let message = 'Email operation failed';
    
    // Check if it's a SendGrid API error response
    if (err.response && err.response.body && err.response.body.errors) {
        const sgErrors = err.response.body.errors;
        
        // Use the first error for the response
        if (sgErrors.length > 0) {
            const sgError = sgErrors[0];
            
            // Map SendGrid error codes to appropriate HTTP status codes and messages
            switch (sgError.message) {
                // Authentication errors
                case 'Forbidden':
                case 'Unauthorized':
                    statusCode = 401; // Unauthorized
                    message = 'Email service authentication failed';
                    break;
                
                // Rate limiting
                case 'Too many requests':
                case 'Rate limit exceeded':
                    statusCode = 429; // Too Many Requests
                    message = 'Email sending rate limit exceeded';
                    break;
                
                // Invalid parameters
                case 'Invalid from email address':
                case 'Invalid to email address':
                    statusCode = 400; // Bad Request
                    message = 'Invalid email address';
                    break;
                
                // Content errors
                case 'Empty content':
                case 'Invalid content':
                    statusCode = 400; // Bad Request
                    message = 'Invalid email content';
                    break;
                
                // Service errors
                case 'Service unavailable':
                    statusCode = 503; // Service Unavailable
                    message = 'Email service temporarily unavailable';
                    break;
                
                default:
                    // If we don't have a specific case, use the original error message
                    message = sgError.message || 'Email service error';
            }
        }
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        // Handle connection errors
        statusCode = 503; // Service Unavailable
        message = 'Unable to connect to email service';
    } else if (err.code === 'ESOCKET') {
        // Handle socket errors
        statusCode = 500;
        message = 'Email service connection error';
    }

    // Return all details
    return { statusCode, message, errorCode: err.code };
}