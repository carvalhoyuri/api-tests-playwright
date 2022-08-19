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

  test.only("Should not allow to create a user with existent email", async ({
    request,
  }) => {
    const userData = generateUserData();
    await request.post("/usuarios", { data: userData });

    const response = await request.post("/usuarios", { data: userData });
    expect(response.status()).toEqual(StatusCodes.BAD_REQUEST);
    const responseBody = await response.json();
    expect(responseBody.message).toEqual("Este email já está sendo usado");
  });
});
