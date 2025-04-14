export const loginToRequest = (user) => {
  return {
      email: user.email,
      password: user.password
  }
}