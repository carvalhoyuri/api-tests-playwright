import { faker, Faker } from "@faker-js/faker";

export const generateUserData = ()=>{
    return{
        nome: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: "true"
    }
    
}

module.exports = {
    generateUserData 
}