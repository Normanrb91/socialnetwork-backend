const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const enviarEmail = (email, subject, html) => {

    const OAuth2_cliente = new OAuth2(process.env.MAIL_CLIENT_ID, process.env.MAIL_CLIENT_SECRECT);
    OAuth2_cliente.setCredentials({ refresh_token: process.env.MAIL_REFRESH_TOKEN });

    try {
        
        const accessToken = OAuth2_cliente.getAccessToken();
        const transporter = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRECT,
                refreshToken: process.env.MAIL_REFRESH_TOKEN,
                accessToken,
            }
        });

        transporter.sendMail({
            from: `Proyecto <${ process.env.MAIL_USERNAME }>`, 
            to: email, 
            subject,
            html, 
        });

    } catch (error) {
    console.log(error);
    }
}

const confirmTemplate = (name, token) => {
    return `        
    <div>
        <h2>Hola ${ name }</h2>
        <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
        <a
            href="http://localhost:${process.env.PORT}/api/auth/verify/${ token }"
            target="_blank"
        >Confirmar Cuenta</a>
    </div>
    `;
}


const deleteTemplate = (name) => {
    return `        
    <div>
        <h2>Hola ${ name }</h2>
        <p>Hemos desactivado tu cuenta de usuario, para volver a reactivar mandanos un email al soporte técnico</p>
    </div>
    `;
}


module.exports = {
enviarEmail,
confirmTemplate,
deleteTemplate

}