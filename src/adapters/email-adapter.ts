import nodemailer from "nodemailer";

export const emailAdapter = {
    sendMail: async (email: string,
               message: string,
               subject: string, accessToken: string) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "genafesenko1985@gmail.com",
                pass: "pzmcieotsbfirksl",
            },
        });

        // send mail with defined transport object
        return await transporter.sendMail({
            from: '"Gena 👻" <genafesenko1985@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: `<a>https://bloggers-comments-posts-user.herokuapp.com/auth/confirm-registration?code=${accessToken}</a>`,
        })
    }
}