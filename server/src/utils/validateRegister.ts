import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Adresse e-mail non valide.",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Le nom d'utilisateur ne peut pas contenir de signe @.",
      },
    ];
  }

  // TODO: push multiple field/message into errors
  if (options.password.length <= 5) {
    return [
      {
        field: "password",
        message: "Le mot de passe doit comporter au moins 6 caractères.",
      },
    ];
  }

  return null;
};
