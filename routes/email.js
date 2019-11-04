//npm install nodemailer --save

/*Na minha primeira tentativa o gmail bloqueou o envio e me mandou um email
falando que estava tentando enviar um email de um aplicativo não seguro,
bastou ir nas configurações do gmail e liberar para enviar,
 nas próximas tentativas o envio foi correto.*/

var nodemailer = require('nodemailer');

var enviar_email = function (user_email, subject_email, html_email) {
	var $usuario = 'residentes.ufrn@gmail.com';
	var $senha = 'web2019.1';

	var transporter = nodemailer.createTransport({
	    service: 'gmail',
			host: 'smtp.gmail.com',
	    auth: {
	        user: $usuario,
	        pass: $senha
	    },
			debug: false,
			logger: true
	});

	var mailOptions = {
	    from: $usuario,
	    to: user_email,
	    subject: subject_email,
	    html: html_email
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
	        console.log(error);
	    } else {
	        console.log('Email enviado: ' + info.response);
	    }
	});
}

module.exports = enviar_email
