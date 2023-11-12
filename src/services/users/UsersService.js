import Service from "@/services/Service.js";

export class UserService extends Service {
  static async searchUserByLogin(userLogin) {
    return await this.api.get(
      "search/users",
      {
        params: {
          q: userLogin
        }
      });
  }
}
