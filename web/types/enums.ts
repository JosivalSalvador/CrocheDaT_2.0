// 1. Substitutos do Prisma (Enums)
export enum Role {
  ADMIN = "ADMIN",
  SUPPORTER = "SUPPORTER",
  USER = "USER",
}

export enum TokenType {
  REFRESH_TOKEN = "REFRESH_TOKEN",
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFY = "EMAIL_VERIFY",
}

export enum ChatType {
  ORDER = "ORDER",
  SUPPORT = "SUPPORT",
}

// Coloquei o CartStatus também, pois vi que ele existe no banco e pode ser cobrado nos schemas
export enum CartStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  ABANDONED = "ABANDONED",
}
