import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.mailing.APP_MAIL,
        pass: config.mailing.APP_PWD
    }
});

export async function mailProducts(cart, user) {
    try {
        let detallePedido = ``;
        cart.products.forEach(element => {
            detallePedido += `
            <tr class="text-center align-middle">
                <td>
                    ${element._id.id}
                </td>
                <td>
                    ${element._id.title}
                </td>
                <td>
                    ${element._id.description}
                </td>
                <td>
                    ${element._id.code}
                </td>
                <td>
                    <img class="rounded mx-auto d-block imagenProducto" src=${element._id.thumbnail}>
                </td>
                <td>
                    $ ${element._id.price}
                </td>
                <td>
                    ${element.quantity}
                </td>
            </tr>
        `;
        });
        let html = `
            <h3>Detalles de compra</h3>
            <p>Nombre: ${user.name}</p>
            <table>
                <thead>
                    <tr class="text-center">
                        <th>ID</th>
                        <th>Nombre del producto</th>
                        <th>Descripción</th>
                        <th>Código</th>
                        <th>Imagen</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                ${detallePedido}
                </tbody>
            </table>                
            `
        let mailTo = "mariagroppo86@gmail.com";
        let subject= 'Nuevo pedido de ' + user.name;
        let mailOptions = {
            from: process.env.APP_MAIL,
            to: mailTo,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions)
        
        subject = 'Detalle de su pedido de compra';
        mailOptions = {
            from: process.env.APP_MAIL,
            to: mailTo,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
       console.log(error)
    }
    
}

export async function mailPwd(userEmail) {
    try {
        
        let html = `
            <h3>Detalles de compra</h3>
            <p>Nombre: ${user.name}</p>
            <table>
                <thead>
                    <tr class="text-center">
                        <th>ID</th>
                        <th>Nombre del producto</th>
                        <th>Descripción</th>
                        <th>Código</th>
                        <th>Imagen</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                ${detallePedido}
                </tbody>
            </table>                
            `
        let mailTo = userEmail;
        let subject= 'Restauración de contraseña';
        let mailOptions = {
            from: process.env.APP_MAIL,
            to: mailTo,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
       console.log(error)
    }
    
}


export async function mailDeleteAccount(user) {
    try {
        console.log("mail a " + user.userEmail)
        let html = `
            <p>Estimado: ${user.first_name}</p>
            <p>Detectamos que no se ha conectado a nuestra página por más de 10 días.</p></br>
            <p>Por lo tanto, su cuenta ha sido eliminada.</p></br>
            <p>Saludos!</p></br>
            `
        let mailTo = user.userEmail;
        let subject= 'Eliminación de cuenta de ' + user.first_name + " " + user.last_name;
        let mailOptions = {
            from: process.env.APP_MAIL,
            to: mailTo,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
       console.log(error)
    }
    
}