import { faker } from "@faker-js/faker";

export const generateUserData = () => {
  const dob = faker.date.birthdate();

  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    sex: faker.person.sex(),
    password: faker.internet.password(),
    dob,
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    secondaryAddress: faker.location.secondaryAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    zip: faker.location.zipCode(),
    mobilePhone: faker.phone.number(),
  };

  userData.prefix = userData.sex === "male" ? "Mr." : "Mrs.";
  userData.email = `${Date.now()}${faker.internet.email({
    firstName: userData.firstName,
    lastName: userData.lastName,
  })}`;
  userData.dob_day = dob.getDate().toString();
  userData.dob_month = dob.toLocaleString("default", { month: "long" });
  userData.dob_year = dob.getFullYear().toString();

  return userData;
};
