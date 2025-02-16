import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useState } from "react";
import { OidcClient, pcdbClient } from "../../lib/pcdbapi";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const apps = await pcdbClient.listOidcClients(session.user.email);
    return { props: { apps } };
  } catch (error) {
    return { props: { apps: [], error: String(error) } };
  }
};

export default function AppsIndex({
  apps,
  error,
}: {
  apps: OidcClient[];
  error?: string;
}) {
  const [isCreating, setIsCreating] = useState(false);

  if (error) {
    return (
      <div className={fr.cx("fr-alert", "fr-alert--error", "fr-mb-3w")}>
        <p>{error}</p>
      </div>
    );
  }

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create app");
      }

      const newApp = await response.json();
      window.location.href = `/apps/${newApp._id}`;
    } catch (error) {
      console.error("Failed to create app:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={fr.cx("fr-mb-10v")}>
      <div
        className={fr.cx(
          "fr-grid-row",
          "fr-grid-row--middle",
          "fr-grid-row--gutters",
          "fr-mb-3w"
        )}
      >
        <div className={fr.cx("fr-col")}>
          <h1>Vos applications</h1>
        </div>
        <div>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            iconId="fr-icon-add-line"
          >
            {isCreating ? "Création en cours..." : "Créer une application"}
          </Button>
        </div>
      </div>

      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        {apps.map((app) => (
          <div key={app._id} className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <Card
              background
              border
              // desc={app.title || app.name}
              horizontal
              linkProps={{
                href: `/apps/${app._id}`,
              }}
              size="small"
              start={
                <>
                  <ul className={fr.cx("fr-badges-group")}>
                    <li>
                      <Badge severity={app.active ? "info" : "warning"}>
                        {app.active ? "Actif" : "Inactif"}
                      </Badge>
                    </li>
                  </ul>
                  {/* {app.site && (
                    <p className={fr.cx("fr-mb-0", "fr-text--xs")}>
                      → {app.site}
                    </p>
                  )} */}
                </>
              }
              title={app.name}
              titleAs="h2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
