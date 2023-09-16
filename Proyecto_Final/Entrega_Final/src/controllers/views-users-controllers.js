import { userService } from "../services/repository.js";
import { mailPremiumChange, mailPremiumChangeSuccessfully } from "../mail/nodemailer.js";

const listAllUsers = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    //console.log(adminOK)
    try {
        let filteredArray2 = [];
        const users = await userService.listUsers();
        const filteredArray = users.map((user) => ({
            name: user.first_name,
            email: user.userEmail,
            role: user.role,
            procedureStatus: user.procedureStatus,
            DNI: user.DNI,
            comp1: user.comprobante1,
            comp2: user.comprobante2,
            id: user._id
          }));
        
        for (let index = 0; index < filteredArray.length; index++) {
            let notPremium = false;
            let notDNI = false;
            let notComp1 = false;
            let notComp2 = false;
            if (filteredArray[index].role === 'user') {
                notPremium = true
            }
            if (filteredArray[index].DNI !== 'Completed') {
                notDNI = true
            }
            if (filteredArray[index].comp1 !== 'Completed') {
                notComp1 = true
            }
            if (filteredArray[index].comp2 !== 'Completed') {
                notComp2 = true
            }
            const element = {
                name: filteredArray[index].name,
                email: filteredArray[index].email,
                role: filteredArray[index].role,
                procedureStatus: filteredArray[index].procedureStatus,
                notPremium: notPremium,
                DNI: filteredArray[index].DNI,
                notDNI: notDNI,
                comp1: filteredArray[index].comp1,
                notComp1: notComp1,
                comp2:  filteredArray[index].comp2,
                notComp2: notComp2,
                id: filteredArray[index].id
            }
            filteredArray2.push(element)
            
        }
        let uExist = false;
        let message = "No hay usuarios registrados en la BD."
        if (filteredArray2.length > 0) {
            uExist = true;
        }
        res.render('../src/views/partials/users-list.hbs', {users: filteredArray2, message: message, uExist, userStatus: true, userName, enabled})

    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "listAllUsers controller error: " + error, userStatus: true, userName, enabled}) 
    }
}


const usersLastConnection = async (req, res, next) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const users = await userService.usersLastConnection();
        let uExist = false;
        let message = "Ningun usuario cuenta con una conexión menor a 10 días."
        if (users.payload.length > 0) {
            uExist = true;
        }
        res.render('../src/views/partials/users-listConn.hbs', {users: users.payload, message: message, uExist, userStatus: true, userName, enabled})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "usersLastConnection controller error: " + error, userStatus: true, userName, enabled}) 

    }
}

const deleteUsersLastConnection = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const users = await userService.deleteUsersLastConnection();
        res.redirect('/users/lastConnection')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "deleteUsersLastConnection controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const uploadPremiumDocForm = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        res.render('../src/views/partials/users-change.hbs', {userStatus: true, userName, enabled})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "uploadPremiumDocForm controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const uploadPremiumDoc = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const filesUploaded = req.files;
        /* filesUploaded.forEach(element => {
            console.log("ELEMENTO -------------------------------------------------------")
            console.log(element);
        }); */
        //Verifico el estado del usuario. Si es premium, no hace fala seguir el proceso.
        if ((req.session.user.role ==='premiumUser') || (req.session.user.role === 'admin')) {
            res.render('../src/views/partials/error.hbs', { message: "You are a PREMIUM user, so you don´t need to update your documents.", userStatus: true, userName, enabled}) 
        } {
            //1. Cambiar el estado del tramite del usuario :uid a Pending.
            const answer = await userService.updateProcedureStatus(req.session.user.email);
            if (answer.status === 'success') {
                //2. Notificar al ADMIN por correo del pedido con los archivos adjuntos.
                await mailPremiumChange(req.session.user);
                res.redirect('/current')
            } else {
                res.render('../src/views/partials/error.hbs', { message: "An error occurs. Please try again.", userStatus: true, userName, enabled}) 
            } 
        }
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "uploadPremiumDoc controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const changeUserToPremium = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const uid = req.params.uid;
        const answer = await userService.getUserByID(uid);
        if (answer.status === 'success') {
            const answer2 = await userService.updateStatus(uid);
            if (answer2.status === 'success') {
                await mailPremiumChangeSuccessfully(answer.value)
                res.redirect("/users")
            } else {
                res.render('../src/views/partials/error.hbs', { message: answer2.message, userStatus: true, userName, enabled})
            }    
        } else {
            res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName, enabled})
        } 
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "changeUserToPremium controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const updateDNIStatus = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const uid = req.params.uid;
        const answer = await userService.updateDNIStatus(uid);
        if (answer.status === 'success') {
            res.redirect("/users")
        } else {
            res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName, enabled}) 
        } 
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateDNIStatus controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const updateComp1Status = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const uid = req.params.uid;
        const answer = await userService.updateComp1Status(uid);
        if (answer.status === 'success') {
            res.redirect("/users")
        } else {
            res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName, enabled}) 
        } 
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateComp1Status controller error: " + error, userStatus: true, userName, enabled}) 
    }
}

const updateComp2Status = async (req, res) => {
    const userName = req.session.user.name;
    let enabled = false;
    if (req.session.user.role === 'admin') {
        enabled = true;
    }
    try {
        const uid = req.params.uid;
        const answer = await userService.updateComp2Status(uid);
        if (answer.status === 'success') {
            res.redirect("/users")
        } else {
            res.render('../src/views/partials/error.hbs', { message: answer.message, userStatus: true, userName, enabled}) 
        } 
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "updateComp2Status controller error: " + error, userStatus: true, userName, enabled}) 
    }
}


export default {
    listAllUsers,
    usersLastConnection,
    deleteUsersLastConnection,
    uploadPremiumDocForm,
    uploadPremiumDoc,
    changeUserToPremium,
    updateDNIStatus,
    updateComp1Status,
    updateComp2Status
}