/* Helper function to make the mail with asterisk mail for security purpose. */
export const maskMail = (email) => {

    const atIndex = email.indexOf('@');
    if (atIndex <= 3) return email;
    
    const start = email.substring(0, 2);
    const end = email.charAt(atIndex - 1);
    const maskedPart = '*'.repeat(atIndex - 3);
    
    return `${start}${maskedPart}${end}${email.substring(atIndex)}`;
};