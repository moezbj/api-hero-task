import { add } from 'date-fns'
import jwt from 'jsonwebtoken'

import { accessSecret, expirationInterval } from '../config/vars'
import { generateToken } from '../middlewares/generateToken'
import { TOKEN_TYPE } from '@prisma/client'

export async function generateUserToken(
  user: number,
): Promise<{ token: string; expiresIn: string }> {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user,
    }
    const expiresIn = add(new Date(), { minutes: expirationInterval })
    console.log('step 1', expiresIn.getTime())

    jwt.sign(
      payload,
      accessSecret,
      {
        expiresIn: expiresIn.getTime(),
      },
      (error, token) => {
        if (error || !token) {
          reject('Unable to generate token')
        } else {
          console.log('step 1', expiresIn.toISOString())

          resolve({ token, expiresIn: expiresIn.toISOString() })
        }
      },
    )
  })
}

export async function generateTokenResponse(user: number) {
  const tokenType = 'Bearer'
  const { token: accessToken, expiresIn } = await generateUserToken(user)
  const { token: refreshToken } = await generateToken(
    user,
    TOKEN_TYPE.REFRESH,
    {
      days: 2,
    },
  )
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  }
}
