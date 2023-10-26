import BaseAPIConfig from './BaseApiConfig'

class AccountAPI {
  controller = 'Accounts'

  /**
   * Mô tả : Lấy toàn bộ dữ liệu phòng ban từ api
   * @Createdby: bqdiep
   * Created date: 21:33 1/09/2022
   */
  async logIn(user) {
    return await BaseAPIConfig.post(`${this.controller}/login`, user)
  }
  async CreateAccount(user) {
    return await BaseAPIConfig.post(`users/insert`, user)
  }
  async logOut() {
    localStorage.setItem('isLoggedIn', false)
    return await BaseAPIConfig.post(`${this.controller}/logout`)
  }
  async changepass(user) {
    return await BaseAPIConfig.post(`${this.controller}/changepass`, user)
  }
  /**
   * Mô tả : login bằng google
   * @param {Object} param
   * @Createdby: bqdiep
   */
  async loginGoogle(param) {
    return await BaseAPIConfig.post(`${this.controller}/loginGoogle`, param)
  }
}
export default new AccountAPI()
// await UserApi.getUserByID(userID).then(
//     (res) => {
//       currentThis.userRoles = res.data.UserRoles;
//       currentThis.user = res.data;
//       currentThis.isShowLoading = false;
//       currentThis.bindingArrayRole();
//     },
//     (err) => {
//       console.log(err);
//       this.isShowLoading = false;
//     }
//   );
