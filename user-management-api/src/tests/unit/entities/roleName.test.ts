import RoleName from "../../../domain/models/roles/roleName";

describe("RoleName", () => {
    it("Deve lançar erro se o nome começar com letra minúscula", () => {
      expect(() => new RoleName("admin")).toThrow("A primeira letra do nome da role deve ser maiúscula");
    });

    it("Deve lançar erro se o nome não tiver pelo menos 3 caracteres", () => {
      expect(() => new RoleName("Ad")).toThrow("Nome da role deve ter pelo menos 3 caracteres");
    });
  
    it("Deve aceitar nomes válidos", () => {
      const roleName = new RoleName("Admin");
      expect(roleName.getName()).toBe("Admin");
    });
  });
  