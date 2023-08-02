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
                    ${element.id}
                </td>
                <td>
                    ${element.title}
                </td>
                <td>
                    ${element.description}
                </td>
                <td>
                    ${element.code}
                </td>
                <td>
                    <img class="rounded mx-auto d-block imagenProducto" src=${element.thumbnail}>
                </td>
                <td>
                    $ ${element.price}
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
        console.log("Correos enviados.")
        
    } catch (error) {
       console.log(error)
    }
    
}
