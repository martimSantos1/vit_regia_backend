export default class RoleDTO {
    constructor(role) {
        this.name = role.name;
    }

    static fromRequest(body) {
        const { name } = body;
        if (!name) {
          throw new Error('Todos os campos são obrigatórios');
        }
        return new RoleDTO(name);
      }
}