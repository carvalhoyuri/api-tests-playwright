import { test, expect, request } from "@playwright/test";
import { EXPECTATION_FAILED, StatusCodes } from "http-status-codes";
import { generateUserData } from "../helpers/helpers";

const existentUser = async ({ request }) => {
  const response = await request.get("/usuarios", { data: generateUserData() });
};

test.describe("User API", () => {
  test("Should return list of users", async ({ request }) => {
    const response = await request.get("/usuarios");
    expect(response.status()).toEqual(StatusCodes.OK);
  });

  test("Should create a new user", async ({ request }) => {
    const response = await request.post("/usuarios", {
      data: generateUserData(),
    });
    const responseBody = await response.json();
    expect(response.status()).toEqual(StatusCodes.CREATED);
    expect(responseBody.message).toEqual("Cadastro realizado com sucesso");
  });

  test("Should not allow to create a user with existent email", async ({
    request,
  }) => {
    const userData = generateUserData();
    await request.post("/usuarios", { data: userData });

    const response = await request.post("/usuarios", { data: userData });
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST);
    const responseBody = await response.json();
    expect(responseBody.message).toEqual("Este email já está sendo usado");
  });

  test("Should return user data searching by id", async ({ request }) => {
    const userData = generateUserData();
    const response = await request.post("/usuarios", { data: userData });
    expect(response.status()).toEqual(StatusCodes.CREATED);
    const responseBody = await response.json();
    const userId = responseBody._id;

    const searchResponse = await request.get(`/usuarios/${userId}`);
    //const searchResponseBody = await searchResponse.json();
    expect(searchResponse.status()).toEqual(StatusCodes.OK);
  });

  test("Should fail when searching a user that does not exists", async ({
    request,
  }) => {
    const response = await request.get("/usuarios/098qwe");
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST);
    const responseBody = await response.json();
    await expect(responseBody.message).toEqual("Usuário não encontrado");
  });

  test("Should delete a user successfully", async ({ request }) => {
    const userData = generateUserData();
    const response = await request.post("/usuarios", { data: userData });
    const responseBody = await response.json();
    const userId = responseBody._id;

    const deleteRequest = await request.delete(`usuarios/${userId}`);
    expect(deleteRequest.status()).toEqual(StatusCodes.OK);
  });
});
