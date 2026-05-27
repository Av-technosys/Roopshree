export default function getEnvVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }

  return value;
}

export const AWS_REGION = getEnvVariable("AWS_REGION");
export const SES_AWS_ACCESS_KEY_ID = getEnvVariable("SES_AWS_ACCESS_KEY_ID");
export const SES_AWS_SECRET_ACCESS_KEY = getEnvVariable("SES_AWS_SECRET_ACCESS_KEY");   
export const DATABASE_URL = getEnvVariable("DATABASE_URL");