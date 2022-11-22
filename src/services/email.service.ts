const nodemailer = require('nodemailer');

export const sendEmail = (sender: string, receiver: string, movie: string) => {
    nodemailer.createTestAccount(async (err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
    
        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    
        const message = {
            from: sender,
            to: receiver,
            subject: 'Movie Suggestion ✔',
            text: 'Hello!',
            html: '<p><b>Hello</b> Could you please watch ' + movie + ' ?</p>'
        };
    
        await transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
    
            console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
        })
    });
    
}
