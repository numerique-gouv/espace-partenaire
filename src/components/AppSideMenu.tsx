import { SideMenu as DsfrSideMenu } from "@codegouvfr/react-dsfr/SideMenu";
import { useRouter } from "next/router";

export const SideMenu = () => {
  const router = useRouter();
  const hash = router.asPath.split("#")[1] || "";

  return (
    <DsfrSideMenu
      className="fr-col-12 fr-col-md-3"
      sticky
      fullHeight
      burgerMenuButtonText="Dans cette rubrique"
      items={[
        {
          isActive: hash === "keys",
          linkProps: {
            href: "#keys",
          },
          text: "Clés",
        },
        {
          isActive: hash === "url",
          linkProps: {
            href: "#url",
          },
          text: "URLs",
        },
        {
          isActive: hash === "alg",
          linkProps: {
            href: "#alg",
          },
          text: "Algorithme",
        },
      ]}
    />
  );
};
