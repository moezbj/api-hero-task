export const projectResolver = {
  Query: {
    project: {
      id: (user: any) => user._id,
      title: (user: any) => user.title,
      description: (user: any) => user.description,
      delivered: (user: any) => user.delivered,
      owner: (user: any) => user.owner,
      company: (user: any) => user.company,
      participant: (user: any) => user.participant,
    },
  },
}
