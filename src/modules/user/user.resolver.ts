export const userResolver = {
  Query: {
    user: {
      id: (user: any) => user._id,
      firstName: (user: any) => user.firstName,
      lastName: (user: any) => user.lastName,
      email: (user: any) => user.email,
      isActive: (user: any) => user.isActive,
      company: (user: any) => user.company,
      role: (user: any) => user.role,
    },
  },
}
