import jwt from "jsonwebtoken";
import UserModel from "../services/users/schema"
import createHttpError from "http-errors"

type MyPayload = {
  _id: string
  username: string
}

interface WAJWTPayload {
  _id: string

}


export const JWTAuthenticate = async (user: User) => {
  const accessToken = await generateJWTToken({
    _id: user._id,
    username: user.username,
    
  });
  const refreshToken = await generateRefreshJWTToken({ _id: user._id });
  return {accessToken, refreshToken};
};

const generateJWTToken = (payload: MyPayload) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

// USAGE: const token = await generateJWTToken({_id: "oaijsdjasdojasoidj"})

const generateRefreshJWTToken = (payload: WAJWTPayload) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token!)
      }
    )
  )

export const verifyJWT = (token: string) =>
  new Promise<WAJWTPayload>((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) reject(err);
      else resolve(payload as WAJWTPayload);
    })
  );

const verifyRefreshToken = (token: string) =>
  new Promise<WAJWTPayload>((resolve, reject) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET!, (err, payload) => {
      if (err) reject(err)
      else resolve(payload as WAJWTPayload)
    })
  );

// USAGE: const payload = await verifyJWT(token)

export const verifyRefreshTokenAndGenerateNewTokens = async (
  currentRefreshToken: string
) => {
  try {
    // 1. Check the validity of the current refresh token (exp date and integrity)
    const payload = await verifyRefreshToken(currentRefreshToken);

    // 2. If token is valid, we shall check if it is the same as the one saved in db
    const user = await UserModel.findById(payload._id);

    if (!user)
      throw createHttpError(404, `User with id ${payload._id} not found!`);

    if (currentRefreshToken) {
      // 3. If everything is fine --> generate accessToken and refreshToken
      const { accessToken, refreshToken } = await JWTAuthenticate(user);

      // 4. Return tokens
      return { accessToken, refreshToken };
    } else {
      throw createHttpError(401, "Refresh token not valid!");
    }
  } catch (error) {
    throw createHttpError(401, "Refresh token expired or compromised!");
  }
};
