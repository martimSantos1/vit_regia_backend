export default class RoleDTO {
  name: string;

  constructor(role: { name: string }) {
      this.name = role.name;
  }
}