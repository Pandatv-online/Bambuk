type RegistryField = "registryCode" | "vatId" | "registeredAddress";

type CompanyRegistryRecord = Readonly<{
  displayName: "Osaühing IKB";
  registryCode: "10161031";
  vatId: "EE100414305";
  registeredAddress: "Mere pst 2, 40231 Sillamäe linn";
  provenance: Readonly<{
    sourceUrl: "https://www.teatmik.ee/ru/personlegal/10161031-Osa%C3%BChing-IKB";
    checkedAt: "2026-09-23";
    fields: readonly RegistryField[];
  }>;
}>;

export const companyRegistryRecord: CompanyRegistryRecord = {
  displayName: "Osaühing IKB",
  registryCode: "10161031",
  vatId: "EE100414305",
  registeredAddress: "Mere pst 2, 40231 Sillamäe linn",
  provenance: {
    sourceUrl: "https://www.teatmik.ee/ru/personlegal/10161031-Osa%C3%BChing-IKB",
    checkedAt: "2026-09-23",
    fields: ["registryCode", "vatId", "registeredAddress"],
  },
};
