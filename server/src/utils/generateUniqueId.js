import crypto from "crypto";

export const generateUniqueId = (prefix = "ITG") => {
  const randomPart = crypto.randomBytes(4).toString("hex");
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${randomPart}`;
};
